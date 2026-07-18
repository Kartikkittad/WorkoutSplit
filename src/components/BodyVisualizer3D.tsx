'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BodyVisualizer3DProps {
  muscleCounts: Record<string, number>;
}

export default function BodyVisualizer3D({ muscleCounts }: BodyVisualizer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Holographic color palette
    const CYAN = 0x00e5ff;
    const DARK_BASE = 0x0a1628;

    // Glow color based on training count — heat scale
    const getGlowColor = (muscleName: string): number => {
      const count = muscleCounts[muscleName] || 0;
      if (count === 0) return 0x1a3a4a;   // Dark teal (barely visible)
      if (count === 1) return 0xFFE066;   // Yellow
      if (count === 2) return 0xFF922B;   // Orange
      return 0xFA5252;                     // Red hot (3+)
    };

    const getEmissiveIntensity = (muscleName: string): number => {
      const count = muscleCounts[muscleName] || 0;
      if (count === 0) return 0.15;
      if (count === 1) return 0.6;
      if (count === 2) return 0.85;
      return 1.2;
    };

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 280;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(0, 0, 2.4);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      setWebglError(true);
      return;
    }

    // Lighting — subtle ambient + point lights for holographic glow
    const ambientLight = new THREE.AmbientLight(0x112233, 0.8);
    scene.add(ambientLight);

    // Cyan point light from front
    const frontGlow = new THREE.PointLight(CYAN, 1.2, 5);
    frontGlow.position.set(0, 0.5, 2);
    scene.add(frontGlow);

    // Subtle back rim light
    const rimLight = new THREE.PointLight(0x0088aa, 0.8, 5);
    rimLight.position.set(0, 1, -2);
    scene.add(rimLight);

    // Bottom glow
    const bottomGlow = new THREE.PointLight(CYAN, 0.4, 4);
    bottomGlow.position.set(0, -1.5, 1);
    scene.add(bottomGlow);

    const mannequin = new THREE.Group();
    scene.add(mannequin);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Create holographic muscle material
    const createMuscleMaterial = (muscleName: string | null) => {
      const glowColor = muscleName ? getGlowColor(muscleName) : 0x1a3a4a;
      const intensity = muscleName ? getEmissiveIntensity(muscleName) : 0.1;
      
      return new THREE.MeshPhongMaterial({
        color: DARK_BASE,
        emissive: glowColor,
        emissiveIntensity: intensity,
        shininess: 60,
        specular: 0x00ccff,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
    };

    // Create wireframe overlay material
    const createWireMaterial = (muscleName: string | null) => {
      const count = muscleName ? (muscleCounts[muscleName] || 0) : 0;
      const wireColor = count > 0 ? getGlowColor(muscleName!) : CYAN;
      const wireOpacity = count > 0 ? 0.7 : 0.2;
      
      return new THREE.MeshBasicMaterial({
        color: wireColor,
        wireframe: true,
        transparent: true,
        opacity: wireOpacity,
      });
    };

    // Create a mesh with wireframe overlay
    const createBody = (geom: THREE.BufferGeometry, muscleName: string | null) => {
      const solidMat = createMuscleMaterial(muscleName);
      const wireMat = createWireMaterial(muscleName);
      
      geometries.push(geom);
      materials.push(solidMat, wireMat);

      const solidMesh = new THREE.Mesh(geom, solidMat);
      const wireMesh = new THREE.Mesh(geom, wireMat);

      const group = new THREE.Group();
      group.add(solidMesh);
      group.add(wireMesh);
      return group;
    };

    // === BODY CONSTRUCTION ===

    // Head
    const headGeom = new THREE.SphereGeometry(0.1, 20, 20);
    const head = createBody(headGeom, null);
    head.scale.set(1, 1.25, 1);
    head.position.set(0, 0.78, 0);
    mannequin.add(head);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.038, 0.044, 0.07, 12);
    const neck = createBody(neckGeom, null);
    neck.position.set(0, 0.66, 0);
    mannequin.add(neck);

    // Trapezius
    const trapGeom = new THREE.CylinderGeometry(0.018, 0.032, 0.11, 10);
    
    const trapL = createBody(trapGeom, 'Back');
    trapL.position.set(-0.06, 0.62, -0.01);
    trapL.rotation.z = -0.55;
    mannequin.add(trapL);

    const trapR = createBody(trapGeom, 'Back');
    trapR.position.set(0.06, 0.62, -0.01);
    trapR.rotation.z = 0.55;
    mannequin.add(trapR);

    // Chest (Left & Right Pecs)
    const pecGeom = new THREE.BoxGeometry(0.10, 0.11, 0.04);
    
    const pecL = createBody(pecGeom, 'Chest');
    pecL.position.set(-0.055, 0.49, 0.048);
    pecL.rotation.set(0.04, 0.06, 0.02);
    mannequin.add(pecL);

    const pecR = createBody(pecGeom, 'Chest');
    pecR.position.set(0.055, 0.49, 0.048);
    pecR.rotation.set(0.04, -0.06, -0.02);
    mannequin.add(pecR);

    // Torso core cylinder
    const torsoGeom = new THREE.CylinderGeometry(0.072, 0.076, 0.35, 14);
    const torso = createBody(torsoGeom, null);
    torso.position.set(0, 0.38, 0);
    mannequin.add(torso);

    // Back (Lats)
    const latGeom = new THREE.CylinderGeometry(0.046, 0.018, 0.21, 10);
    
    const latL = createBody(latGeom, 'Back');
    latL.position.set(-0.08, 0.45, -0.04);
    latL.rotation.z = 0.12;
    mannequin.add(latL);

    const latR = createBody(latGeom, 'Back');
    latR.position.set(0.08, 0.45, -0.04);
    latR.rotation.z = -0.12;
    mannequin.add(latR);

    // Shoulders (Deltoids)
    const deltGeom = new THREE.SphereGeometry(0.06, 14, 14);
    
    const deltL = createBody(deltGeom, 'Shoulders');
    deltL.scale.set(1.05, 1.35, 1.1);
    deltL.position.set(-0.15, 0.51, 0);
    mannequin.add(deltL);

    const deltR = createBody(deltGeom, 'Shoulders');
    deltR.scale.set(1.05, 1.35, 1.1);
    deltR.position.set(0.15, 0.51, 0);
    mannequin.add(deltR);

    // Biceps
    const bicepGeom = new THREE.CylinderGeometry(0.036, 0.03, 0.19, 10);
    
    const bicepL = createBody(bicepGeom, 'Biceps');
    bicepL.position.set(-0.16, 0.34, 0.014);
    mannequin.add(bicepL);

    const bicepR = createBody(bicepGeom, 'Biceps');
    bicepR.position.set(0.16, 0.34, 0.014);
    mannequin.add(bicepR);

    // Triceps
    const tricepGeom = new THREE.CylinderGeometry(0.036, 0.03, 0.19, 10);

    const tricepL = createBody(tricepGeom, 'Triceps');
    tricepL.position.set(-0.16, 0.34, -0.014);
    mannequin.add(tricepL);

    const tricepR = createBody(tricepGeom, 'Triceps');
    tricepR.position.set(0.16, 0.34, -0.014);
    mannequin.add(tricepR);

    // Forearms
    const forearmGeom = new THREE.CylinderGeometry(0.03, 0.022, 0.19, 10);
    
    const forearmL = createBody(forearmGeom, null);
    forearmL.position.set(-0.16, 0.15, 0);
    mannequin.add(forearmL);

    const forearmR = createBody(forearmGeom, null);
    forearmR.position.set(0.16, 0.15, 0);
    mannequin.add(forearmR);

    // Hands
    const handGeom = new THREE.SphereGeometry(0.022, 10, 10);
    
    const handL = createBody(handGeom, null);
    handL.scale.set(1, 1.3, 0.6);
    handL.position.set(-0.16, 0.025, 0);
    mannequin.add(handL);

    const handR = createBody(handGeom, null);
    handR.scale.set(1, 1.3, 0.6);
    handR.position.set(0.16, 0.025, 0);
    mannequin.add(handR);

    // Abs (Six Pack segments)
    const abGeom = new THREE.BoxGeometry(0.042, 0.038, 0.014);
    for (let r = 0; r < 3; r++) {
      const y = 0.36 - r * 0.048;
      
      const abL = createBody(abGeom, 'Core');
      abL.position.set(-0.03, y, 0.063);
      mannequin.add(abL);

      const abR = createBody(abGeom, 'Core');
      abR.position.set(0.03, y, 0.063);
      mannequin.add(abR);
    }

    // Obliques
    const obliqueGeom = new THREE.CylinderGeometry(0.032, 0.026, 0.17, 10);
    
    const obliqueL = createBody(obliqueGeom, 'Core');
    obliqueL.position.set(-0.076, 0.28, 0.03);
    mannequin.add(obliqueL);

    const obliqueR = createBody(obliqueGeom, 'Core');
    obliqueR.position.set(0.076, 0.28, 0.03);
    mannequin.add(obliqueR);

    // Lower Back
    const lowerBackGeom = new THREE.BoxGeometry(0.13, 0.15, 0.065);
    const lowerBack = createBody(lowerBackGeom, 'Back');
    lowerBack.position.set(0, 0.27, -0.042);
    mannequin.add(lowerBack);

    // Pelvis
    const pelvisGeom = new THREE.BoxGeometry(0.19, 0.09, 0.085);
    const pelvis = createBody(pelvisGeom, null);
    pelvis.position.set(0, 0.13, 0.01);
    mannequin.add(pelvis);

    // Glutes
    const gluteGeom = new THREE.SphereGeometry(0.07, 14, 14);
    
    const gluteL = createBody(gluteGeom, 'Glutes');
    gluteL.scale.set(1.1, 1, 1.2);
    gluteL.position.set(-0.062, 0.11, -0.045);
    mannequin.add(gluteL);

    const gluteR = createBody(gluteGeom, 'Glutes');
    gluteR.scale.set(1.1, 1, 1.2);
    gluteR.position.set(0.062, 0.11, -0.045);
    mannequin.add(gluteR);

    // Quads
    const quadGeom = new THREE.CylinderGeometry(0.05, 0.04, 0.33, 12);
    const quadSweepGeom = new THREE.CylinderGeometry(0.032, 0.018, 0.25, 10);

    const quadL = createBody(quadGeom, 'Quads');
    quadL.position.set(-0.068, -0.1, 0.018);
    mannequin.add(quadL);

    const sweepL = createBody(quadSweepGeom, 'Quads');
    sweepL.position.set(-0.105, -0.07, 0.018);
    sweepL.rotation.z = 0.07;
    mannequin.add(sweepL);

    const quadR = createBody(quadGeom, 'Quads');
    quadR.position.set(0.068, -0.1, 0.018);
    mannequin.add(quadR);

    const sweepR = createBody(quadSweepGeom, 'Quads');
    sweepR.position.set(0.105, -0.07, 0.018);
    sweepR.rotation.z = -0.07;
    mannequin.add(sweepR);

    // Hamstrings
    const hamGeom = new THREE.CylinderGeometry(0.05, 0.04, 0.33, 12);

    const hamL = createBody(hamGeom, 'Hamstrings');
    hamL.position.set(-0.068, -0.1, -0.018);
    mannequin.add(hamL);

    const hamR = createBody(hamGeom, 'Hamstrings');
    hamR.position.set(0.068, -0.1, -0.018);
    mannequin.add(hamR);

    // Knees
    const kneeGeom = new THREE.SphereGeometry(0.032, 10, 10);
    const kneeL = createBody(kneeGeom, null);
    kneeL.position.set(-0.068, -0.28, 0.004);
    mannequin.add(kneeL);

    const kneeR = createBody(kneeGeom, null);
    kneeR.position.set(0.068, -0.28, 0.004);
    mannequin.add(kneeR);

    // Calves (Gastrocnemius bulge + taper)
    const calfBulgeGeom = new THREE.SphereGeometry(0.043, 12, 12);
    const calfTaperGeom = new THREE.CylinderGeometry(0.036, 0.02, 0.30, 10);

    const calfBulgeL = createBody(calfBulgeGeom, 'Calves');
    calfBulgeL.scale.set(1, 1.35, 1);
    calfBulgeL.position.set(-0.068, -0.37, -0.018);
    mannequin.add(calfBulgeL);

    const calfTaperL = createBody(calfTaperGeom, 'Calves');
    calfTaperL.position.set(-0.068, -0.45, -0.004);
    mannequin.add(calfTaperL);

    const calfBulgeR = createBody(calfBulgeGeom, 'Calves');
    calfBulgeR.scale.set(1, 1.35, 1);
    calfBulgeR.position.set(0.068, -0.37, -0.018);
    mannequin.add(calfBulgeR);

    const calfTaperR = createBody(calfTaperGeom, 'Calves');
    calfTaperR.position.set(0.068, -0.45, -0.004);
    mannequin.add(calfTaperR);

    // Shins
    const shinGeom = new THREE.CylinderGeometry(0.034, 0.02, 0.30, 10);
    
    const shinL = createBody(shinGeom, null);
    shinL.position.set(-0.068, -0.45, 0.014);
    mannequin.add(shinL);

    const shinR = createBody(shinGeom, null);
    shinR.position.set(0.068, -0.45, 0.014);
    mannequin.add(shinR);

    // Ankles
    const ankleGeom = new THREE.SphereGeometry(0.02, 10, 10);
    const ankleL = createBody(ankleGeom, null);
    ankleL.position.set(-0.068, -0.61, 0);
    mannequin.add(ankleL);

    const ankleR = createBody(ankleGeom, null);
    ankleR.position.set(0.068, -0.61, 0);
    mannequin.add(ankleR);

    // Feet
    const footGeom = new THREE.BoxGeometry(0.046, 0.03, 0.11);
    
    const footL = createBody(footGeom, null);
    footL.position.set(-0.068, -0.645, 0.024);
    mannequin.add(footL);

    const footR = createBody(footGeom, null);
    footR.position.set(0.068, -0.645, 0.024);
    mannequin.add(footR);

    // Center
    mannequin.position.y = -0.1;

    // ─── ROTATION INTERACTION ───
    let isDragging = false;
    let previousMouseX = 0;

    const handleStart = (clientX: number) => {
      isDragging = true;
      previousMouseX = clientX;
    };

    const handleMove = (clientX: number) => {
      if (!isDragging) return;
      const deltaX = clientX - previousMouseX;
      mannequin.rotation.y += deltaX * 0.015;
      previousMouseX = clientX;
    };

    const handleEnd = () => {
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) handleStart(e.touches[0].clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    mannequin.rotation.y = 0.2;

    // Pulse animation for glow
    let pulseTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      pulseTime += 0.02;
      
      // Subtle pulse on the front glow light
      frontGlow.intensity = 1.2 + Math.sin(pulseTime) * 0.15;
      
      if (!isDragging) {
        mannequin.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width || width;
        height = entry.contentRect.height || height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [muscleCounts]);

  if (webglError) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
        3D rendering not supported on this device.
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '280px', 
        position: 'relative', 
        cursor: 'grab',
        touchAction: 'none',
      }} 
    />
  );
}
