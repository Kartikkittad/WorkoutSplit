'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BodyVisualizer3DProps {
  muscleCounts: Record<string, number>;
  height?: number;
}

export default function BodyVisualizer3D({ muscleCounts, height: mountHeight = 280 }: BodyVisualizer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Anatomy-style palette — grey body, heat-scale muscles
    const NEUTRAL = 0xd2d3d6;   // body / untrained (light grey silhouette)
    const SHADOW = 0xc2c3c7;    // slightly darker neutral for depth parts

    const getMuscleColor = (muscleName: string): number => {
      const count = muscleCounts[muscleName] || 0;
      if (count === 0) return NEUTRAL;    // untrained = same grey as body
      if (count === 1) return 0xffd43b;   // yellow
      if (count === 2) return 0xff922b;   // orange
      return 0xfa5252;                     // red hot (3+)
    };

    let width = container.clientWidth || 300;
    let height = container.clientHeight || mountHeight;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(0, 0, 2.4);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 0); // transparent — white container shows through
      container.appendChild(renderer.domElement);
    } catch {
      setWebglError(true);
      return;
    }

    // Bright studio lighting for a white background
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.45);
    fillLight.position.set(-3, 1, -3);
    scene.add(fillLight);

    const mannequin = new THREE.Group();
    scene.add(mannequin);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Solid matte material — trained muscles get a slight glow to pop
    const createMaterial = (muscleName: string | null, baseColor?: number) => {
      const color = muscleName ? getMuscleColor(muscleName) : (baseColor ?? NEUTRAL);
      const trained = muscleName ? (muscleCounts[muscleName] || 0) > 0 : false;
      return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.05,
        emissive: trained ? color : 0x000000,
        emissiveIntensity: trained ? 0.18 : 0,
      });
    };

    const createPart = (geom: THREE.BufferGeometry, muscleName: string | null, baseColor?: number) => {
      const mat = createMaterial(muscleName, baseColor);
      geometries.push(geom);
      materials.push(mat);
      return new THREE.Mesh(geom, mat);
    };

    // === BODY CONSTRUCTION — organic capsules & spheres ===
    // Torso is elliptical (flattened front-to-back) so muscle overlays can
    // hug the silhouette instead of poking out of a round tube.

    // Head
    const head = createPart(new THREE.SphereGeometry(0.078, 24, 24), null, SHADOW);
    head.scale.set(1, 1.2, 1.05);
    head.position.set(0, 0.775, 0);
    mannequin.add(head);

    // Neck
    const neck = createPart(new THREE.CapsuleGeometry(0.035, 0.06, 8, 16), null, SHADOW);
    neck.position.set(0, 0.66, 0);
    mannequin.add(neck);

    // Trapezius — sloping from neck to shoulders (visible from top/back)
    const trapGeom = new THREE.SphereGeometry(0.045, 18, 18);
    ([-1, 1] as const).forEach(side => {
      const trap = createPart(trapGeom.clone(), 'Back');
      trap.scale.set(1.6, 0.5, 0.7);
      trap.position.set(side * 0.07, 0.615, -0.01);
      trap.rotation.z = side * -0.28;
      mannequin.add(trap);
    });

    // Torso — tapered chest to waist, flattened depth
    const torso = createPart(new THREE.CylinderGeometry(0.125, 0.095, 0.40, 28), null);
    torso.scale.z = 0.55;
    torso.position.set(0, 0.42, 0);
    mannequin.add(torso);

    // Pelvis / hips
    const pelvis = createPart(new THREE.CylinderGeometry(0.095, 0.115, 0.16, 28), null);
    pelvis.scale.z = 0.6;
    pelvis.position.set(0, 0.15, 0);
    mannequin.add(pelvis);

    // Pectorals — wide flat plates on the chest
    const pecGeom = new THREE.SphereGeometry(0.075, 20, 20);
    ([-1, 1] as const).forEach(side => {
      const pec = createPart(pecGeom.clone(), 'Chest');
      pec.scale.set(1.05, 0.55, 0.32);
      pec.position.set(side * 0.05, 0.545, 0.055);
      mannequin.add(pec);
    });

    // Deltoids — cap the shoulders, blending into the arms
    const deltGeom = new THREE.SphereGeometry(0.055, 20, 20);
    ([-1, 1] as const).forEach(side => {
      const delt = createPart(deltGeom.clone(), 'Shoulders');
      delt.scale.set(1.1, 1.2, 0.9);
      delt.position.set(side * 0.165, 0.555, 0);
      mannequin.add(delt);
    });

    // Upper arms — bicep (front) + tricep (back) capsules overlapping
    const upperArmGeom = new THREE.CapsuleGeometry(0.032, 0.12, 8, 16);
    ([-1, 1] as const).forEach(side => {
      const bicep = createPart(upperArmGeom.clone(), 'Biceps');
      bicep.position.set(side * 0.168, 0.41, 0.012);
      mannequin.add(bicep);

      const tricep = createPart(upperArmGeom.clone(), 'Triceps');
      tricep.position.set(side * 0.168, 0.41, -0.012);
      mannequin.add(tricep);
    });

    // Forearms
    const forearmGeom = new THREE.CapsuleGeometry(0.026, 0.13, 8, 16);
    ([-1, 1] as const).forEach(side => {
      const forearm = createPart(forearmGeom.clone(), null);
      forearm.position.set(side * 0.17, 0.25, 0.004);
      mannequin.add(forearm);
    });

    // Hands
    const handGeom = new THREE.SphereGeometry(0.022, 14, 14);
    ([-1, 1] as const).forEach(side => {
      const hand = createPart(handGeom.clone(), null, SHADOW);
      hand.scale.set(1, 1.35, 0.6);
      hand.position.set(side * 0.17, 0.14, 0);
      mannequin.add(hand);
    });

    // Abs — 3x2 shallow segments on the stomach
    const abGeom = new THREE.SphereGeometry(0.024, 14, 14);
    for (let row = 0; row < 3; row++) {
      ([-1, 1] as const).forEach(side => {
        const ab = createPart(abGeom.clone(), 'Core');
        ab.scale.set(1.3, 1, 0.45);
        ab.position.set(side * 0.027, 0.40 - row * 0.048, 0.058);
        mannequin.add(ab);
      });
    }

    // Obliques — subtle side bands
    const obliqueGeom = new THREE.CapsuleGeometry(0.02, 0.1, 8, 14);
    ([-1, 1] as const).forEach(side => {
      const oblique = createPart(obliqueGeom.clone(), 'Core');
      oblique.position.set(side * 0.075, 0.34, 0.048);
      oblique.rotation.z = side * -0.05;
      mannequin.add(oblique);
    });

    // Lats — back wings, visible from behind
    const latGeom = new THREE.SphereGeometry(0.06, 18, 18);
    ([-1, 1] as const).forEach(side => {
      const lat = createPart(latGeom.clone(), 'Back');
      lat.scale.set(0.7, 1.6, 0.5);
      lat.position.set(side * 0.072, 0.46, -0.048);
      mannequin.add(lat);
    });

    // Lower back
    const lowerBack = createPart(new THREE.SphereGeometry(0.055, 18, 18), 'Back');
    lowerBack.scale.set(1.4, 1, 0.5);
    lowerBack.position.set(0, 0.30, -0.05);
    mannequin.add(lowerBack);

    // Glutes — tucked behind the pelvis
    const gluteGeom = new THREE.SphereGeometry(0.06, 18, 18);
    ([-1, 1] as const).forEach(side => {
      const glute = createPart(gluteGeom.clone(), 'Glutes');
      glute.scale.set(0.85, 0.85, 1);
      glute.position.set(side * 0.045, 0.135, -0.06);
      mannequin.add(glute);
    });

    // Quads (front of thigh) + outer sweep
    const quadGeom = new THREE.CapsuleGeometry(0.045, 0.24, 8, 18);
    const sweepGeom = new THREE.CapsuleGeometry(0.026, 0.16, 8, 14);
    ([-1, 1] as const).forEach(side => {
      const quad = createPart(quadGeom.clone(), 'Quads');
      quad.position.set(side * 0.062, -0.04, 0.012);
      mannequin.add(quad);

      const sweep = createPart(sweepGeom.clone(), 'Quads');
      sweep.position.set(side * 0.095, -0.02, 0.008);
      sweep.rotation.z = side * -0.06;
      mannequin.add(sweep);
    });

    // Hamstrings (back of thigh)
    const hamGeom = new THREE.CapsuleGeometry(0.042, 0.22, 8, 18);
    ([-1, 1] as const).forEach(side => {
      const ham = createPart(hamGeom.clone(), 'Hamstrings');
      ham.position.set(side * 0.062, -0.05, -0.025);
      mannequin.add(ham);
    });

    // Knees
    const kneeGeom = new THREE.SphereGeometry(0.032, 14, 14);
    ([-1, 1] as const).forEach(side => {
      const knee = createPart(kneeGeom.clone(), null);
      knee.position.set(side * 0.062, -0.225, 0.005);
      mannequin.add(knee);
    });

    // Calves — bulge behind shin
    const calfGeom = new THREE.SphereGeometry(0.038, 16, 16);
    ([-1, 1] as const).forEach(side => {
      const calf = createPart(calfGeom.clone(), 'Calves');
      calf.scale.set(1, 1.6, 0.9);
      calf.position.set(side * 0.062, -0.32, -0.018);
      mannequin.add(calf);
    });

    // Shins
    const shinGeom = new THREE.CapsuleGeometry(0.024, 0.22, 8, 14);
    ([-1, 1] as const).forEach(side => {
      const shin = createPart(shinGeom.clone(), null);
      shin.position.set(side * 0.062, -0.39, 0.006);
      mannequin.add(shin);
    });

    // Feet
    const footGeom = new THREE.SphereGeometry(0.028, 14, 14);
    ([-1, 1] as const).forEach(side => {
      const foot = createPart(footGeom.clone(), null, SHADOW);
      foot.scale.set(1.2, 0.5, 2.2);
      foot.position.set(side * 0.062, -0.55, 0.03);
      mannequin.add(foot);
    });

    // Center vertically
    mannequin.position.y = -0.09;

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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

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
        height: `${mountHeight}px`,
        position: 'relative',
        cursor: 'grab',
        touchAction: 'none',
      }}
    />
  );
}
