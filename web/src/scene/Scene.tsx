import { Suspense, useMemo, useRef, useEffect, type MutableRefObject } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'
import Env from './Env'
import { FOCUS_POINTS, FRAMES_PER_NODE } from '../data/focusPoints'

useGLTF.preload(`${import.meta.env.BASE_URL}models/me.glb`)

// Focus anchors (focus-* empty objects in glb), order corresponds to resume nodes; list is single source of truth, see data/focusPoints.ts
const POINTS = FOCUS_POINTS as readonly string[]
const M = POINTS.length // Timeline node count (= resume entry count), derived from list, not hardcoded
const RESUME_FRAMES = M * FRAMES_PER_NODE // Resume section frames: FRAMES_PER_NODE frames per node (node k → frame k·50)
const WORKS_ENTRANCE = 50 // Works section "entrance" (gallery screen slides in from bottom to cover) frames
const FPS = 24 // All clips @24fps share timeline; camera animation total frames read from CameraAction clip at runtime (see totalFrames)
const NODE_LINE = 0.3 // Node "end" reference line: entry top reaching this viewport height (30% from top) locks to that node

// Vertical gradient background sphere (wraps camera), top/bottom colors adjustable
function GradientBackground() {
  // glb camera FOV is very narrow (~23°), only sees a strip in the middle of gradient; steepness stretches visible narrow band to show full transition
  const top = '#6f906f'
  const bottom = '#dbd3b5'
  const steep = 1.4

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color() },
      uBottom: { value: new THREE.Color() },
      uSteep: { value: 1 },
    }),
    []
  )
  uniforms.uTop.value.set(top)
  uniforms.uBottom.value.set(bottom)
  uniforms.uSteep.value = steep

  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uTop;
          uniform vec3 uBottom;
          uniform float uSteep;
          varying vec3 vDir;
          void main() {
            // Stretch centered on horizon (y=0) by steepness, so full transition visible even under narrow-fov
            float t = clamp(vDir.y * uSteep * 0.5 + 0.5, 0.0, 1.0);
            gl_FragColor = vec4(mix(uBottom, uTop, t), 1.0);
          }
        `}
      />
    </mesh>
  )
}

// All light sources (HDRI environment + hemisphere + key/fill directional lights)
function Lights() {
  const c = {
    envIntensity: 0.85,
    hemiIntensity: 1.15,
    hemiSky: '#ffffff',
    hemiGround: '#404040',
    keyIntensity: 2.35,
    keyColor: '#ffd9c6',
    keyPos: [5, 8, 5] as [number, number, number],
    fillIntensity: 2.25,
    fillColor: '#9fc6ff',
    fillPos: [-5, 4, -4] as [number, number, number],
  }

  return (
    <>
      <Env
        intensity={c.envIntensity}
        rotationX={0}
        rotationY={0}
        rotationZ={0}
        asBackground={false}
        bgIntensity={0.4}
        bgBlur={0}
      />
      <hemisphereLight args={[c.hemiSky, c.hemiGround, c.hemiIntensity]} />
      <directionalLight
        position={c.keyPos}
        intensity={c.keyIntensity}
        color={c.keyColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={c.fillPos} intensity={c.fillIntensity} color={c.fillColor} />
    </>
  )
}

// me.glb: model + glb built-in camera animation (scroll-driven 5-segment wipe) + auto-focus + eye-follow
function Man2({
  focusRef,
  frameRef,
  dofBokehRef,
  dofRangeRef,
}: {
  focusRef: MutableRefObject<THREE.Vector3>
  frameRef: MutableRefObject<number>
  dofBokehRef: MutableRefObject<number>
  dofRangeRef: MutableRefObject<number>
}) {
  const posX = 0
  const posY = 0.4
  const posZ = -0.7
  const scale = 2.25
  const rotationY = 0

  // mobilePullback: mobile camera pullback multiplier along "focus→camera" direction (1 = unchanged, 1.2 = 20% farther)
  // mobileTimelineShift: mobile "timeline phase" camera horizontal shift, unit = viewport distance ratio (positive = left shift, negative = right shift, 0 = off)
  const cam = {
    damping: 0.1,
    dwell: 0.35,
    parallax: 4,
    parallaxEase: 0.1,
    mobilePullback: 1.2,
    mobileTimelineShift: 0.12,
  }

  const eye = {
    enabled: true,
    gain: 3,
    maxYaw: 15,
    maxPitch: 8,
    invertX: false,
    invertY: false,
    smooth: 0.44,
    crossEye: 45,
    crossRadius: 0.25,
  }

  const get = useThree((s) => s.get)
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/me.glb`)

  // Clone model; collect eye objects, focus anchor objects, glb built-in camera, per-anchor depth-of-field switches
  const { model, eyes, points, startPoint, glbCam, focusNode, dof } = useMemo(() => {
    const clone = scene.clone(true)
    const eyes: any[] = []
    const pmap: Record<string, any> = {}
    let startPoint: any = null
    let glbCam: any = null
    let focusNode: any = null
    clone.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
      if (o.isCamera) glbCam = o
      // Hero anchor: compatible with old name focus-start and intro3d unified naming focus-0
      if (o.name === 'focus-start' || o.name === 'focus-0') startPoint = o
      if (o.name === 'focus-works') focusNode = o
      if (POINTS.includes(o.name)) pmap[o.name] = o
      if (/eye/i.test(o.name)) {
        // Smooth shading: recompute smooth vertex normals + disable flatShading
        if (o.isMesh) {
          o.geometry.computeVertexNormals()
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m: any) => {
            m.flatShading = false
            m.needsUpdate = true
          })
        }
        eyes.push({ obj: o, base: o.quaternion.clone(), x: o.position.x })
      }
    })
    // Determine left/right by local x: leftmost eye sx=-1, rightmost eye sx=+1, used for cross-eye inward direction
    if (eyes.length > 1) {
      const xs = eyes.map((e) => e.x)
      const min = Math.min(...xs)
      const max = Math.max(...xs)
      const mid = (min + max) / 2
      eyes.forEach((e) => {
        e.sx = e.x < mid ? -1 : 1
      })
    } else {
      eyes.forEach((e) => (e.sx = 0))
    }
    const pts = POINTS.map((n) => pmap[n] || null)
    // Works section anchor: prioritize focus-works (old glb); fallback (intro3d unified naming not exported) reuses last timeline node focus-M.
    const works = focusNode || pts[pts.length - 1] || null
    // Hero anchor: focus-start / focus-0; if neither, fallback to first timeline node.
    const start = startPoint || pts[0] || null
    // Per-anchor depth-of-field parameters (intro3d export writes to userData/extras): dofBokeh blur strength, dofFocusRange clear range,
    // dofEnabled switch (off → effective bokeh records 0). has=false (old glb without these fields) → Post2 uses original global frame blend, behavior unchanged.
    const ud = (o: any): any => o?.userData ?? {}
    const hasDofParams = [...pts, start, works].some((o) => ud(o).dofBokeh !== undefined)
    const effBokeh = (o: any): number => (ud(o).dofEnabled === false ? 0 : (ud(o).dofBokeh ?? 0))
    const effRange = (o: any): number => ud(o).dofFocusRange ?? 0
    return {
      model: clone,
      eyes,
      points: pts,
      startPoint: start,
      glbCam,
      focusNode: works,
      dof: {
        has: hasDofParams,
        bokeh: pts.map(effBokeh),
        range: pts.map(effRange),
        startBokeh: effBokeh(start),
        startRange: effRange(start),
        worksBokeh: effBokeh(works),
        worksRange: effRange(works),
      },
    }
  }, [scene])

  // Camera animation total frames: read from CameraAction clip (fallback to longest clip / default resume+entrance+shift), not hardcoded.
  // Works section frame segment = [RESUME_FRAMES, totalFrames], length depends on glb (current me.glb is 100 frames).
  const totalFrames = useMemo(() => {
    const clips: any[] = animations || []
    const cam = clips.find((c: any) => c.name === 'CameraAction')
    const clip = cam || (clips.length ? clips.reduce((a, b) => (b.duration > a.duration ? b : a)) : null)
    return clip ? Math.round(clip.duration * FPS) : RESUME_FRAMES + 2 * WORKS_ENTRANCE
  }, [animations])

  // Animation mixer: attach all clips (manAction + CameraAction), set time per frame + update(0) to wipe
  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model])
  const actions = useRef<any[]>([])
  useEffect(() => {
    if (!animations || animations.length === 0) return
    mixer.stopAllAction()
    actions.current = animations.map((clip) => {
      const a = mixer.clipAction(clip)
      a.play()
      a.paused = true
      return { action: a, duration: clip.duration }
    })
    return () => {
      mixer.stopAllAction()
      actions.current = []
    }
  }, [mixer, animations])

  // Don't switch active camera (avoid post-processing CoC caching old camera near/far causing overall blur).
  // Instead copy glb camera world transform + fov to default camera every frame.

  // Window-level mouse input (smouse is smoothed value)
  const mouse = useRef({ x: 0, y: 0 })
  const smouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Mobile / touch screen (no mouse to follow): disable eye-follow, eyes keep default orientation.
  // Detection = touch pointer or narrow viewport (≤640px, consistent with mobile style breakpoint).
  const isMobile = useRef(
    typeof window !== 'undefined' &&
      (window.matchMedia?.('(pointer: coarse)').matches === true ||
        window.innerWidth <= 640)
  )

  // Resume anchor DOM elements (determine which segment currently playing)
  const anchorEls = useRef<any>(null)
  // Works section gallery DOM element (determines works entrance / horizontal shift phase frames)
  const galleryEl = useRef<any>(null)

  // Reuse objects to avoid per-frame allocation
  const frameSmooth = useRef(0)
  const posA = useRef(new THREE.Vector3())
  const posB = useRef(new THREE.Vector3())

  const tmpEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const tmpQuat = useRef(new THREE.Quaternion())
  const desiredQuat = useRef(new THREE.Quaternion())
  const tmpVec = useRef(new THREE.Vector3())

  // For copying glb camera world transform
  const camPos = useRef(new THREE.Vector3())
  const camQuat = useRef(new THREE.Quaternion())
  const camScl = useRef(new THREE.Vector3())
  const paraEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const paraQuat = useRef(new THREE.Quaternion())

  useFrame((_, dt) => {
    const a = 1 - Math.pow(cam.damping, dt)

    // 1) Calculate continuous index s from resume anchors (document coordinates):
    //    Top s≈-1, sysu centered s=0, hotsar=1 … zooop=4
    if (!anchorEls.current) {
      anchorEls.current = POINTS.map((n) => document.querySelector(`[data-point="${n}"]`))
    }
    const els = anchorEls.current
    // Node dwell: remap each scroll segment with dwell—near a node, s stays unchanged (dwell),
    // fast transition to next node in segment middle. Only changes "scroll→s" rhythm, glb animation remains linear function of s.
    const d = THREE.MathUtils.clamp(cam.dwell, 0, 0.49)
    const dwell = (t: number) => {
      if (d <= 0) return t
      if (t < d) return 0
      if (t > 1 - d) return 1
      return THREE.MathUtils.smoothstep((t - d) / (1 - 2 * d), 0, 1)
    }
    let sTarget = THREE.MathUtils.clamp(frameSmooth.current / FRAMES_PER_NODE - 1, -1, M - 1)
    if (els && els.length === M && els.every(Boolean)) {
      // Reference line at NODE_LINE height in viewport; anchors use entry top (text position, excluding bottom large padding)
      const refLine = window.scrollY + window.innerHeight * NODE_LINE
      const tops = els.map((el: any) => el.getBoundingClientRect().top + window.scrollY)
      if (refLine <= tops[0]) {
        // Top → sysu fade-in segment: when scrollY=0, s=-1 (frame 0), when sysu reaches reference line, s=0
        const heroScroll = Math.max(1, tops[0] - window.innerHeight * NODE_LINE)
        sTarget = -1 + dwell(THREE.MathUtils.clamp(window.scrollY / heroScroll, 0, 1))
      } else if (refLine >= tops[M - 1]) {
        sTarget = M - 1
      } else {
        for (let i = 0; i < M - 1; i++) {
          if (refLine <= tops[i + 1]) {
            const t = (refLine - tops[i]) / Math.max(1, tops[i + 1] - tops[i])
            sTarget = i + dwell(t)
            break
          }
        }
      }
    }
    // 2) Frame-driven: first calculate "target frame" (resume/works unified, both sides at boundary are RESUME_FRAMES → continuous),
    //    then smooth final frame once—avoid instant jump from previous "smooth s + direct rectTop" path inconsistency.
    //    Resume section 0–RESUME_FRAMES (node i→(i+1)·50); works section = entrance (screen slides in) + first section horizontal shift, until last frame
    let frameTarget = THREE.MathUtils.clamp((sTarget + 1) * FRAMES_PER_NODE, 0, RESUME_FRAMES)
    let inWorks = false
    if (!galleryEl.current) galleryEl.current = document.querySelector('.wk-gallery')
    if (galleryEl.current) {
      const ih = window.innerHeight
      const rectTop = galleryEl.current.getBoundingClientRect().top
      const range = Math.max(0, galleryEl.current.offsetHeight - ih)
      if (rectTop < ih) {
        inWorks = true
        // Entrance segment end frame (when works screen fully covers): resume end + entrance frames, clamped to total frames
        const entranceEnd = Math.min(RESUME_FRAMES + WORKS_ENTRANCE, totalFrames)
        if (rectTop > 0) {
          // Works screen slides from bottom (rectTop=ih) to fully cover (rectTop=0): entrance frame segment
          const pA = THREE.MathUtils.clamp(1 - rectTop / ih, 0, 1)
          frameTarget = RESUME_FRAMES + (entranceEnd - RESUME_FRAMES) * pA
        } else {
          // Already pinned, first section horizontal shift (previous full screen 100vw shift): entrance end → last frame, then freeze at last frame
          // Vertical scroll 1:1 with horizontal shift (px); horizontal shift 100vw = innerWidth px
          const scrolled = THREE.MathUtils.clamp(-rectTop, 0, range)
          const pB = THREE.MathUtils.clamp(scrolled / window.innerWidth, 0, 1)
          frameTarget = entranceEnd + (totalFrames - entranceEnd) * pB
        }
      }
    }
    // Smoothing intensity transitions with target frame: ≤RESUME_FRAMES normal smooth; entrance segment gradually off; after entrance a=1 (direct follow, no smooth)
    const smoothOff = THREE.MathUtils.smoothstep(frameTarget, RESUME_FRAMES, RESUME_FRAMES + WORKS_ENTRANCE)
    const aEff = THREE.MathUtils.lerp(a, 1, smoothOff)
    frameSmooth.current += (frameTarget - frameSmooth.current) * aEff
    const frame = frameSmooth.current
    // All clips share timeline: time = frame/FPS, each clamped to own duration
    // (shorter clips hold last frame after playback, camera clip CameraAction runs full totalFrames)
    if (actions.current.length) {
      const t = frame / FPS
      for (const { action: act, duration } of actions.current) {
        act.time = Math.min(t, duration)
      }
      mixer.update(0)
    }
    if (frameRef) frameRef.current = frame

    // Continuous index for resume section focus: derived from smoothed frame, ensures focus syncs with camera
    const s = THREE.MathUtils.clamp(frame / FRAMES_PER_NODE - 1, -1, M - 1)

    // 3) Auto-focus: works section follows glb focus-works empty object; resume section interpolates by focus anchors
    //    (get world coordinates after mixer.update to ensure consistency with current frame)
    if (focusRef) {
      if (inWorks && focusNode) {
        focusNode.getWorldPosition(focusRef.current)
      } else if (s < 0 && startPoint && points[0]) {
        startPoint.getWorldPosition(posA.current)
        points[0].getWorldPosition(posB.current)
        focusRef.current.lerpVectors(posA.current, posB.current, THREE.MathUtils.clamp(s + 1, 0, 1))
      } else {
        const sc = THREE.MathUtils.clamp(s, 0, M - 1)
        const iA = Math.floor(sc)
        const iB = Math.min(iA + 1, M - 1)
        const f = sc - iA
        if (points[iA] && points[iB]) {
          points[iA].getWorldPosition(posA.current)
          points[iB].getWorldPosition(posB.current)
          focusRef.current.lerpVectors(posA.current, posB.current, f)
        }
      }
    }

    // 3b) Depth of field: when glb carries per-anchor parameters (intro3d export), interpolate bokeh/focusRange between adjacent anchors along current continuous index,
    //     write to refs for Post2 direct use (faithfully restore intro3d); no parameters (old glb) write sentinel -1 → Post2 uses original global frame blend.
    if (dofBokehRef && dofRangeRef) {
      if (!dof.has) {
        dofBokehRef.current = -1
      } else {
        const sample = (arr: number[], sv: number, wv: number): number => {
          if (inWorks) return wv
          if (s < 0) return THREE.MathUtils.lerp(sv, arr[0] ?? sv, THREE.MathUtils.clamp(s + 1, 0, 1))
          const sc = THREE.MathUtils.clamp(s, 0, M - 1)
          const iA = Math.floor(sc)
          const iB = Math.min(iA + 1, M - 1)
          return THREE.MathUtils.lerp(arr[iA] ?? 0, arr[iB] ?? 0, sc - iA)
        }
        dofBokehRef.current = sample(dof.bokeh, dof.startBokeh, dof.worksBokeh)
        // focusRange converted to world units by model group scale (scene scaled by scale factor, clear range needs same scale to match intro3d visual).
        dofRangeRef.current = sample(dof.range, dof.startRange, dof.worksRange) * scale
      }
    }

    // 2b) Copy glb camera world transform to default camera, and do orbital mouse parallax around focus (focus screen position unchanged)
    const camera: any = get().camera
    if (glbCam && camera.isPerspectiveCamera) {
      glbCam.updateWorldMatrix(true, false)
      glbCam.matrixWorld.decompose(camPos.current, camQuat.current, camScl.current)
      // Mouse smoothing: infinitely approach target value
      const me = 1 - Math.pow(cam.parallaxEase, dt)
      smouse.current.x += (mouse.current.x - smouse.current.x) * me
      smouse.current.y += (mouse.current.y - smouse.current.y) * me
      const ax = THREE.MathUtils.degToRad(cam.parallax)
      paraEuler.current.set(-smouse.current.y * ax, -smouse.current.x * ax, 0)
      paraQuat.current.setFromEuler(paraEuler.current)
      // Rotate camera position around focus + synchronously rotate orientation → focus stays still, only parallax around edges
      tmpVec.current
        .copy(camPos.current)
        .sub(focusRef.current)
        .applyQuaternion(paraQuat.current)
      // Mobile pull back along "focus→camera" direction: focus screen position unchanged, subject smaller, more whitespace
      if (isMobile.current) tmpVec.current.multiplyScalar(cam.mobilePullback)
      tmpVec.current.add(focusRef.current)
      camera.position.copy(tmpVec.current)
      camera.quaternion.multiplyQuaternions(paraQuat.current, camQuat.current)
      // Mobile "timeline phase" shifts camera left overall, separating subject from full-width text.
      // Weight: fade in from Hero (s: -0.8→0.3), fade out when entering works section with smoothOff → no jump.
      if (isMobile.current && cam.mobileTimelineShift !== 0) {
        const tlWeight = THREE.MathUtils.smoothstep(s, -0.8, 0.3) * (1 - smoothOff)
        if (tlWeight > 0) {
          // translateX along local +X (screen right); negative → camera left shift
          const dist = camera.position.distanceTo(focusRef.current)
          camera.translateX(-dist * cam.mobileTimelineShift * tlWeight)
        }
      }
      if (camera.fov !== glbCam.fov) {
        camera.fov = glbCam.fov
        camera.updateProjectionMatrix()
      }
    }

    // 4) Eye-follow (use current active camera for screen projection); skip on mobile/touch
    if (!eye.enabled || eyes.length === 0 || isMobile.current) return
    const sx = eye.invertX ? -1 : 1
    const sy = eye.invertY ? -1 : 1

    let ax = 0
    let ay = 0
    for (const e of eyes) {
      e.obj.getWorldPosition(tmpVec.current).project(camera)
      ax += tmpVec.current.x
      ay += tmpVec.current.y
    }
    ax /= eyes.length
    ay /= eyes.length

    const mx = mouse.current.x - ax
    const my = mouse.current.y - ay
    const yawBase = sx * mx * THREE.MathUtils.degToRad(eye.maxYaw) * eye.gain
    const pitch = sy * -my * THREE.MathUtils.degToRad(eye.maxPitch) * eye.gain

    const dist = Math.hypot(mx, my)
    const convWeight = THREE.MathUtils.clamp(1 - dist / eye.crossRadius, 0, 1)
    const convRad = THREE.MathUtils.degToRad(eye.crossEye) * convWeight

    for (const e of eyes) {
      const yaw = yawBase - e.sx * convRad
      tmpEuler.current.set(pitch, yaw, 0)
      tmpQuat.current.setFromEuler(tmpEuler.current)
      desiredQuat.current.copy(tmpQuat.current).multiply(e.base)
      e.obj.quaternion.slerp(desiredQuat.current, eye.smooth)
    }
  })

  return (
    <group
      position={[posX, posY, posZ]}
      rotation={[0, (rotationY * Math.PI) / 180, 0]}
      scale={scale}
    >
      <primitive object={model} />
    </group>
  )
}

// Post-processing: DepthOfField → Bloom → SMAA.
// DoF focus follows focusRef frame-by-frame (auto-focus); tighten clear range and increase blur between 30–220 frames.
function Post2({
  focusRef,
  frameRef,
  dofBokehRef,
  dofRangeRef,
}: {
  focusRef: MutableRefObject<THREE.Vector3>
  frameRef: MutableRefObject<number>
  dofBokehRef: MutableRefObject<number>
  dofRangeRef: MutableRefObject<number>
}) {
  const post = {
    bloomIntensity: 0.6,
    bloomThreshold: 0.82,
    dof: true,
    startBokeh: 7.4,
    startRange: 2.0,
    focusBokeh: 11.0,
    focusRange: 0.15,
    startBlendFrame: 48,
    endBlendFrame: RESUME_FRAMES - 50, // Near last node return to "start frame" depth-of-field tier (originally 250−50=200)
  }

  const dofRef = useRef<any>(null)
  useFrame(() => {
    const e = dofRef.current
    if (!e) return
    if (e.target && focusRef) e.target.copy(focusRef.current)
    // Weight w=1 uses "start frame tier", w=0 uses "focus point tier".
    // Start (f→0) and last node (f→RESUME_FRAMES) both use start frame tier; middle nodes use focus point tier.
    const f = frameRef ? frameRef.current : 0
    const wStart = 1 - THREE.MathUtils.smoothstep(f, 0, post.startBlendFrame)
    const wEnd = THREE.MathUtils.smoothstep(f, post.endBlendFrame, RESUME_FRAMES)
    const w = Math.max(wStart, wEnd)
    if (dofBokehRef && dofBokehRef.current >= 0) {
      // glb built-in per-anchor depth-of-field parameters (intro3d export): directly use, faithfully restore intro3d blur strength/clear range (bokeh=0 means depth-of-field off at that point).
      e.bokehScale = dofBokehRef.current
      if (e.cocMaterial) e.cocMaterial.focusRange = Math.max(1e-4, dofRangeRef ? dofRangeRef.current : post.focusRange)
    } else {
      // Old glb (no per-anchor parameters): use original global frame blend tiers.
      e.bokehScale = THREE.MathUtils.lerp(post.focusBokeh, post.startBokeh, w)
      if (e.cocMaterial) e.cocMaterial.focusRange = THREE.MathUtils.lerp(post.focusRange, post.startRange, w)
    }
  })

  return (
    <EffectComposer multisampling={0} stencilBuffer={false} depthBuffer>
      {(post.dof ? (
        <DepthOfField
          ref={dofRef}
          target={[0, 1.3, 0]}
          worldFocusRange={post.focusRange}
          bokehScale={post.focusBokeh}
          height={480}
        />
      ) : null) as any}
      <Bloom
        mipmapBlur
        intensity={post.bloomIntensity}
        luminanceThreshold={post.bloomThreshold}
        luminanceSmoothing={0.3}
      />
      <SMAA />
    </EffectComposer>
  )
}

// Scene root component: display me.glb (camera driven by glb animation + scroll)
export default function Scene() {
  const focusRef = useRef(new THREE.Vector3(0, 1.3, 0))
  const frameRef = useRef(0)
  // Per-anchor depth-of-field (carried by intro3d exported glb): Man2 writes per frame, Post2 reads. dofBokeh=-1 means no parameters → Post2 uses old global blend.
  const dofBokehRef = useRef(-1)
  const dofRangeRef = useRef(0.15)
  return (
    <>
      <GradientBackground />

      <Suspense fallback={null}>
        <Lights />
        <Man2 focusRef={focusRef} frameRef={frameRef} dofBokehRef={dofBokehRef} dofRangeRef={dofRangeRef} />
      </Suspense>

      <Post2 focusRef={focusRef} frameRef={frameRef} dofBokehRef={dofBokehRef} dofRangeRef={dofRangeRef} />
    </>
  )
}
