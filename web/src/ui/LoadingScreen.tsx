import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'

// Full-screen loading overlay: read three LoadingManager progress (useProgress),
// fade out and unload after all models/textures loaded (progress reached 100), ensuring scene ready on entry.
// Pure dynamic UI: rotating ring filling with real progress, no text.
// Use CSS transition + setTimeout to control fade-out/unload (doesn't depend on rAF, reliable in background/offscreen).
export default function LoadingScreen() {
  const { progress } = useProgress()
  // reached: whether progress has reached 100% (one-way false→true, avoid jitter from batch loading)
  const [reached, setReached] = useState(false)
  const [hiding, setHiding] = useState(false) // Start fade-out
  const [removed, setRemoved] = useState(false) // Completely unload
  // Record highest progress to prevent ring shrinking during batch resource registration
  const peak = useRef(0)
  peak.current = Math.max(peak.current, Math.min(Math.max(progress, 0), 100))

  useEffect(() => {
    if (progress >= 100) setReached(true)
  }, [progress])

  // After reaching 100%: stay briefly → fade out → unload (one-time, locked unaffected by subsequent progress changes)
  useEffect(() => {
    if (!reached) return
    const t1 = setTimeout(() => setHiding(true), 400)
    const t2 = setTimeout(() => setRemoved(true), 1100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reached])

  if (removed) return null

  const R = 34
  const C = 2 * Math.PI * R
  const offset = C * (1 - peak.current / 100)

  return (
    <div className={`loading-screen${hiding ? ' is-hidden' : ''}`} aria-hidden="true">
      <div className="loading-ring">
        <svg viewBox="0 0 80 80">
          <circle className="lr-track" cx="40" cy="40" r={R} />
          <circle
            className="lr-arc"
            cx="40"
            cy="40"
            r={R}
            style={{ strokeDasharray: C, strokeDashoffset: offset }}
          />
        </svg>
      </div>
    </div>
  )
}
