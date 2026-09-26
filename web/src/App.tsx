import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import * as THREE from 'three'
import Scene from './scene/Scene'
import NoiseOverlay from './ui/NoiseOverlay'
import Resume from './ui/Resume'
import Works from './ui/Works'
import Contact from './ui/Contact'
import Documents from './ui/Documents'
import LoadingScreen from './ui/LoadingScreen'
import { useStore } from './store'

function Backdrop() {
  // Click empty space to close details
  const setActive = useStore((s) => s.setActive)
  return (
    <mesh position={[0, 0, -40]} onClick={() => setActive(null)}>
      <planeGeometry args={[600, 300]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

type Lang = 'en' | 'zh'

const COPY = {
  en: {
    title: 'About Ahanaf',
    paragraphs: [
      "I'm Ahanaf Mokammel Omi — a Full-Stack Developer experienced in building scalable web applications and backend systems with ASP.NET Core, C#, SQL Server, PostgreSQL, Redis, and JavaScript. Strong in system design, database optimization, distributed systems, and AI-powered applications, with a focus on clean code, performance, and reliable software delivery.",
    ],
  },
  zh: {
    title: 'About Ahanaf',
    paragraphs: [
      "I'm Ahanaf Mokammel Omi — a Full-Stack Developer experienced in building scalable web applications and backend systems with ASP.NET Core, C#, SQL Server, PostgreSQL, Redis, and JavaScript. Strong in system design, database optimization, distributed systems, and AI-powered applications, with a focus on clean code, performance, and reliable software delivery.",
    ],
  },
}

function Hero({ lang, cueOpacity }: { lang: Lang; cueOpacity: MotionValue<number> }) {
  const { title, paragraphs } = COPY[lang]
  const aboutRef = useRef(null)
  // Trigger point early: about section starts when top reaches 60% of viewport (offset[0] progress 0), reaching top is progress 1
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ['start 0.6', 'start start'],
  })
  // Opacity goes to 0 when about top reaches about 30vh: start 60%→progress p means top at 0.6×(1−p),
  // set =0.3 to solve p=0.5, so opacity interval [0, 0.5]
  const blur = useTransform(scrollYProgress, [0, 0.5], ['blur(0px)', 'blur(16px)'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  // Parallax: title rises faster, letter spacing increases with scroll; body rises slower
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -96])
  const bodyY = useTransform(scrollYProgress, [0, 1], [0, -52])
  const titleSpacing = useTransform(scrollYProgress, [0, 1], ['0.01em', '0.42em'])
  return (
    <section className="hero">
      <motion.div
        className="about"
        lang={lang}
        ref={aboutRef}
        style={{ filter: blur, opacity }}
      >
        {/* Entry animation placed inside to avoid its fill locking opacity and overriding outer scroll opacity */}
        <div className="about-intro">
          <motion.h1 className="about-title" style={{ y: titleY, letterSpacing: titleSpacing }}>
            {title}
          </motion.h1>
          {paragraphs.map((p, i) => (
            <motion.p key={i} className="about-body" style={{ y: bodyY }}>
              {p}
            </motion.p>
          ))}
        </div>
      </motion.div>
      <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
        <span className="scroll-cue-label">{lang === 'en' ? 'SCROLL' : 'SCROLL DOWN'}</span>
        <span className="scroll-cue-track">
          <span className="scroll-cue-dot" />
        </span>
      </motion.div>
    </section>
  )
}

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button className="lang-toggle" onClick={onToggle} aria-label="Switch language">
      {lang === 'en' ? 'Chinese' : 'EN'}
    </button>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const currentYear = new Date().getFullYear()
  const { scrollY } = useScroll()
  // Works section overlay: drive 3D dimming + blur based on works section top entering from viewport bottom to middle
  const worksRef = useRef(null)
  const { scrollYProgress: worksProgress } = useScroll({
    target: worksRef,
    offset: ['start end', 'start center'],
  })
  const fogBg = useTransform(
    worksProgress,
    [0, 1],
    ['rgba(8, 11, 18, 0)', 'rgba(8, 11, 18, 0.41)'] // Dimming halved (originally 0.82)
  )
  const fogBlur = useTransform(worksProgress, [0, 1], ['blur(0px)', 'blur(10px)'])
  // Scroll dimming: dim 3D scene after leaving hero section to ensure resume text readability
  const scrimOpacity = useTransform(scrollY, [0, 520], [0, 0.4])
  // Hero scroll cue fades out accordingly
  const cueOpacity = useTransform(scrollY, [0, 160], [1, 0])
  // Hero bottom gradient: fades out after scrolling starts
  const heroGradientOpacity = useTransform(scrollY, [0, 240], [1, 0])
  // Frosted right rail: fades in when entering resume section (hero section not frosted)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const railOpacity = useTransform(scrollY, [vh * 0.5, vh * 1.1], [0, 1])
  // Hero decorative frame/corners: fade out after scrolling
  const heroChromeOpacity = useTransform(scrollY, [0, 280], [1, 0])

  return (
    <>
      {/* Loading overlay: covers full screen before model fully loads, fades out after completion */}
      <LoadingScreen />

      {/* Fixed 3D background */}
      <div className="scene-bg">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 19], fov: 39, near: 0.1, far: 500 }}
          gl={{ antialias: false, stencil: false, depth: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <color attach="background" args={['#0a0e16']} />
          <Suspense fallback={null}>
            <Backdrop />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll dimming overlay */}
      <motion.div className="scrim" style={{ opacity: scrimOpacity }} aria-hidden="true" />

      {/* Works section fixed overlay: only dimming (halved), blur commented out for now */}
      <motion.div
        className="stage-fog"
        style={{ background: fogBg /* , backdropFilter: fogBlur, WebkitBackdropFilter: fogBlur */ }}
        aria-hidden="true"
      />

      {/* Fixed frosted right rail (fades in when entering resume section) */}
      <motion.div className="glass-rail" style={{ opacity: railOpacity }} aria-hidden="true" />

      {/* Hero bottom gradient, fades out after scrolling — temporarily commented out to check effect */}
      {/* <motion.div
        className="hero-gradient"
        style={{ opacity: heroGradientOpacity }}
        aria-hidden="true"
      /> */}

      {/* Language toggle temporarily hidden, default to Chinese */}
      {/* <LangToggle lang={lang} onToggle={() => setLang((l) => (l === 'en' ? 'zh' : 'en'))} /> */}

      {/* Hero decoration: hairline inner frame + four corner markers + corner metadata (fades out with scroll) */}
      <motion.div className="hero-chrome" style={{ opacity: heroChromeOpacity }} aria-hidden="true">
        <div className="hero-frame" />
        <span className="hero-mark tl">+</span>
        <span className="hero-mark tr">+</span>
        <span className="hero-mark bl">+</span>
        <span className="hero-mark br">+</span>
        <div className="hero-meta hm-tl">
          <span className="hm-name">Ahanaf Mokammel Omi</span>
          <span>Full-Stack Developer</span>
        </div>
        <div className="hero-meta hm-tr">Portfolio — {currentYear}</div>
        <div className="hero-meta hm-bl">ASP.NET Core · C# · AI · Distributed Systems</div>
        <div className="hero-meta hm-right">Based in Dhaka, Bangladesh</div>
      </motion.div>

      {/* Full-screen film grain overlay (multiply blend) */}
      <NoiseOverlay />

      {/* Scrollable content */}
      <main className="content">
        <Hero lang={lang} cueOpacity={cueOpacity} />
        <Resume lang={lang} />
        <Contact lang={lang} />
        <Documents lang={lang} />
        <Works lang={lang} innerRef={worksRef} />
      </main>
    </>
  )
}
