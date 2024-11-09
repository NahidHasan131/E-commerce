// src/components/Image3D.js
import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const Image3D = ({ imageUrl }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl)  // Load image as texture

  return (
    <mesh rotation={[0, 0.1, 0]}>  {/* Optional slight rotation for 3D effect */}
      <planeGeometry args={[2, 3]} />  {/* Adjust dimensions as needed */}
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export default Image3D
