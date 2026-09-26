import { useEffect, useRef } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import * as THREE from 'three'

// env.hdr as lighting / reflection environment (IBL), and optionally as visible background (replacing Sky.jsx sky sphere).
// three r163+ natively supports scene.environmentRotation / scene.backgroundRotation.
export default function Env({
  intensity,
  rotationX,
  rotationY,
  rotationZ,
  asBackground,
  bgIntensity,
  bgBlur,
}: {
  intensity: number
  rotationX: number
  rotationY: number
  rotationZ: number
  asBackground: boolean
  bgIntensity: number
  bgBlur: number
}) {
  const scene = useThree((s) => s.scene)
  const texture = useLoader(RGBELoader, `${import.meta.env.BASE_URL}textures/env.hdr`)

  // Record background before takeover (dark color set in App.jsx), restore when asBackground disabled.
  const initialBg = useRef<any>(null)
  useEffect(() => {
    initialBg.current = scene.background
  }, [scene])

  // As lighting/reflection environment
  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
    return () => {
      scene.environment = null
    }
  }, [scene, texture])

  useEffect(() => {
    scene.environmentIntensity = intensity
  }, [scene, intensity])

  // Rotation: same set of Euler angles (degrees→radians) simultaneously drive environment reflection and background orientation
  useEffect(() => {
    const x = THREE.MathUtils.degToRad(rotationX)
    const y = THREE.MathUtils.degToRad(rotationY)
    const z = THREE.MathUtils.degToRad(rotationZ)
    scene.environmentRotation.set(x, y, z)
    scene.backgroundRotation.set(x, y, z)
  }, [scene, rotationX, rotationY, rotationZ])

  // As visible background
  useEffect(() => {
    scene.background = asBackground ? texture : initialBg.current
    return () => {
      scene.background = initialBg.current
    }
  }, [scene, texture, asBackground])

  // 背景曝光控制：backgroundIntensity 只缩放背景显示亮度，不影响场景受光；
  // backgroundBlurriness 柔化背景、削弱刺眼高光。
  useEffect(() => {
    scene.backgroundIntensity = bgIntensity
    scene.backgroundBlurriness = bgBlur
  }, [scene, bgIntensity, bgBlur])

  return null
}
