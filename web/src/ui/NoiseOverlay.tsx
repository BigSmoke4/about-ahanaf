import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, invalidate, useFrame } from '@react-three/fiber'
import { DoubleSide, Vector2 } from 'three'

// Full-screen film grain overlay (ported from speakio homepage): independent Canvas + multiply blend,
// frameloop="demand" throttled to ~0.8fps, almost no performance cost.
const CONFIG = { zIndex: 100, opacity: 0.5, alpha: 1 }
const SHADER_VERSION = 'noise-v1'
const num = (v: number) => v.toFixed(3)

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x)
      + (c - a) * u.y * (1.0 - u.x)
      + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 pixel = gl_FragCoord.xy;
    float frame = uTime;
    float mask = noise(pixel / uResolution.y * 30.0 + 1000.0*hash(vec2(frame * 0.1))) * 0.2;
    mask = smoothstep(0.005, 0.03, mask);
    float b = noise(pixel / uResolution.y * 30.0 + 1000.0*hash(vec2(frame * 0.1))) * 0.2;
    b += noise(pixel / uResolution.y * 60.0 + 1000.0*hash(vec2(frame * 0.2))) * 0.5;
    b = clamp(b, 0.0, 1.0);
    b = smoothstep(0.1, 0.12, b);
    vec3 color = mix(vec3(0.2, 0.4, 0.45), vec3(1.0, 1.4, 1.3), b);
    color += vec3(mask);
    color *= hash(pixel / uResolution.y * 200.0 + 1000.0*hash(vec2(frame * 0.3))) * 4.0;
    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4(color, ${num(CONFIG.alpha)});
  }
`

function NoisePlane() {
  const materialRef = useRef<any>(null)
  const resolution = useMemo(() => new Vector2(), [])
  const lastTimeRef = useRef(-999)
  const frameRate = 1

  useFrame(({ clock, size }) => {
    if (!materialRef.current) return
    if (clock.elapsedTime - lastTimeRef.current < (1 / frameRate) * 0.5) return
    lastTimeRef.current = clock.elapsedTime
    materialRef.current.uniforms.uTime.value = clock.elapsedTime % 10000
    resolution.set(size.width, size.height)
    materialRef.current.uniforms.uResolution.value = resolution
  })

  // demand mode: periodic invalidate triggers redraw, resulting in slowly flickering grain
  useEffect(() => {
    const interval = setInterval(() => invalidate(), 1000 / frameRate)
    return () => clearInterval(interval)
  }, [])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uResolution: { value: resolution } }),
    [resolution]
  )

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        key={SHADER_VERSION}
        ref={materialRef}
        transparent
        depthTest={false}
        depthWrite={false}
        side={DoubleSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default function NoiseOverlay() {
  // Mount only on client to avoid SSR inconsistency (this project is pure CSR, still maintaining consistent pattern)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      data-three-noise-overlay={SHADER_VERSION}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: CONFIG.zIndex,
        mixBlendMode: 'multiply',
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%', opacity: CONFIG.opacity, pointerEvents: 'none' }}
        frameloop="demand"
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <NoisePlane />
      </Canvas>
    </div>
  )
}
