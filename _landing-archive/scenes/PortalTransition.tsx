"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

interface PortalTransitionProps {
    progress?: number; // 0-1
    onComplete?: () => void;
}

const portalVertexShader = `
  varying vec2 vUv;
  varying float vDepth;
  uniform float uTime;
  uniform float uProgress;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Tunnel distortion — pull vertices inward as progress increases
    float angle = atan(pos.y, pos.x);
    float radius = length(pos.xy);
    float pull = uProgress * 2.0;

    pos.x += cos(angle) * sin(uTime + radius * 5.0) * 0.1 * pull;
    pos.y += sin(angle) * cos(uTime + radius * 3.0) * 0.1 * pull;
    pos.z -= uProgress * radius * 2.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vDepth = gl_Position.z;
  }
`;

const portalFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center);

    // Vortex pattern
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float spiral = sin(angle * 6.0 + dist * 20.0 - uTime * 4.0) * 0.5 + 0.5;

    // Portal ring
    float ring = smoothstep(0.35, 0.3, dist) - smoothstep(0.3, 0.15, dist);
    ring *= uProgress;

    // Core glow
    float core = smoothstep(0.2, 0.0, dist) * uProgress;

    // Color
    vec3 orangeGlow = vec3(0.976, 0.451, 0.086);
    vec3 whiteCore = vec3(1.0, 0.95, 0.9);
    vec3 darkBg = vec3(0.031, 0.031, 0.039);

    vec3 color = darkBg;
    color = mix(color, orangeGlow, ring * spiral);
    color = mix(color, whiteCore, core * 0.8);

    // Particle streaks being sucked in
    float streak = sin(angle * 12.0 - uTime * 8.0 + dist * 30.0);
    streak = smoothstep(0.7, 1.0, streak) * smoothstep(0.5, 0.2, dist) * uProgress;
    color += orangeGlow * streak * 0.3;

    float alpha = ring + core * 0.8 + streak * 0.2;
    alpha = clamp(alpha, 0.0, 1.0);

    // Flash at full progress
    float flash = smoothstep(0.85, 1.0, uProgress) * (1.0 - smoothstep(0.95, 1.0, uProgress));
    color = mix(color, vec3(1.0), flash * 0.6);
    alpha = max(alpha, flash * 0.8);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function PortalTransition({ progress = 0, onComplete }: PortalTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        material: THREE.ShaderMaterial;
        raf: number;
    } | null>(null);
    const progressRef = useRef(progress);
    const completedRef = useRef(false);

    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const w = container.clientWidth;
        const h = container.clientHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
        camera.position.z = 3;

        const material = new THREE.ShaderMaterial({
            vertexShader: portalVertexShader,
            fragmentShader: portalFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
        });

        // Portal disc geometry
        const portalGeom = new THREE.CircleGeometry(2, 128, 0, Math.PI * 2);
        const portal = new THREE.Mesh(portalGeom, material);
        scene.add(portal);

        // Ring of orbiting particles
        const ringCount = 200;
        const ringPositions = new Float32Array(ringCount * 3);
        const ringColors = new Float32Array(ringCount * 3);
        for (let i = 0; i < ringCount; i++) {
            const angle = (i / ringCount) * Math.PI * 2;
            const r = 1.5 + Math.random() * 0.8;
            ringPositions[i * 3] = Math.cos(angle) * r;
            ringPositions[i * 3 + 1] = Math.sin(angle) * r;
            ringPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

            const brightness = 0.5 + Math.random() * 0.5;
            ringColors[i * 3] = 0.976 * brightness;
            ringColors[i * 3 + 1] = 0.451 * brightness;
            ringColors[i * 3 + 2] = 0.086 * brightness;
        }

        const ringGeom = new THREE.BufferGeometry();
        ringGeom.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
        ringGeom.setAttribute("color", new THREE.BufferAttribute(ringColors, 3));

        const ringMat = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const ringParticles = new THREE.Points(ringGeom, ringMat);
        scene.add(ringParticles);

        stateRef.current = { renderer, scene, camera, material, raf: 0 };

        const startTime = Date.now();

        function animate() {
            const state = stateRef.current;
            if (!state) return;
            state.raf = requestAnimationFrame(animate);

            const elapsed = (Date.now() - startTime) * 0.001;
            const p = progressRef.current;

            state.material.uniforms.uTime.value = elapsed;
            state.material.uniforms.uProgress.value = p;

            // Procedural camera choreography
            state.camera.fov = 60 - p * 25;
            state.camera.updateProjectionMatrix();
            state.camera.position.z = 3 - p * 2.5;

            // Cinematic camera shake intensifies near the end
            const shakeAmt = p > 0.6 ? (p - 0.6) * 0.05 : 0;
            state.camera.rotation.x = Math.sin(elapsed * 15) * shakeAmt;
            state.camera.rotation.y = Math.cos(elapsed * 12) * shakeAmt;
            state.camera.rotation.z = Math.sin(elapsed * 2) * 0.02 * p;

            // Rotate ring particles, pull inward with progress
            ringParticles.rotation.z = elapsed * 0.5 + p * 3;
            const rScale = Math.max(0.1, 1 - p * 0.9);
            ringParticles.scale.set(rScale, rScale, rScale);
            (ringParticles.material as THREE.PointsMaterial).opacity = 0.8 * (1 - p * 0.3);

            // Trigger complete callback
            if (p >= 0.98 && !completedRef.current) {
                completedRef.current = true;
                onComplete?.();
            }

            state.renderer.render(state.scene, state.camera);
        }

        animate();

        const onResize = () => {
            if (!container || !stateRef.current) return;
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            stateRef.current.renderer.setSize(nw, nh);
            stateRef.current.camera.aspect = nw / nh;
            stateRef.current.camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (stateRef.current) {
                cancelAnimationFrame(stateRef.current.raf);
                stateRef.current.renderer.dispose();
                stateRef.current.renderer.domElement.remove();
                stateRef.current = null;
            }
        };
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
