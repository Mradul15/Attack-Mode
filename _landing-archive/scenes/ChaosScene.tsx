"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

interface ChaosSceneProps {
    intensity?: number; // 0-1, controlled by scroll
}

export default function ChaosScene({ intensity = 1 }: ChaosSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const intensityRef = useRef(intensity);
    const stateRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        particles: THREE.Points;
        lines: THREE.LineSegments;
        velocities: Float32Array;
        raf: number;
    } | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Setup
        const w = container.clientWidth;
        const h = container.clientHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
        camera.position.z = 30;

        // Particles
        const count = 800;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        const palette = [
            new THREE.Color("#f97316"), // orange
            new THREE.Color("#ef4444"), // red
            new THREE.Color("#dc2626"), // dark red
            new THREE.Color("#fb923c"), // light orange
            new THREE.Color("#64647a"), // muted
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 60;
            positions[i3 + 1] = (Math.random() - 0.5) * 40;
            positions[i3 + 2] = (Math.random() - 0.5) * 30;

            velocities[i3] = (Math.random() - 0.5) * 0.08;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.08;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.04;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const particleGeom = new THREE.BufferGeometry();
        particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(particleGeom, particleMat);
        scene.add(particles);

        // Lines between nearby particles
        const lineGeom = new THREE.BufferGeometry();
        const linePositions = new Float32Array(count * count * 0.01 * 6); // rough max
        lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xf97316,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const lines = new THREE.LineSegments(lineGeom, lineMat);
        scene.add(lines);

        stateRef.current = { renderer, scene, camera, particles, lines, velocities, raf: 0 };

        // Animation loop
        function animate() {
            const state = stateRef.current;
            if (!state) return;
            state.raf = requestAnimationFrame(animate);

            const pos = state.particles.geometry.attributes.position as THREE.BufferAttribute;
            const arr = pos.array as Float32Array;

            // Move particles
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                arr[i3] += state.velocities[i3] * intensityRef.current;
                arr[i3 + 1] += state.velocities[i3 + 1] * intensityRef.current;
                arr[i3 + 2] += state.velocities[i3 + 2] * intensityRef.current;

                // Wrap around
                if (arr[i3] > 30) arr[i3] = -30;
                if (arr[i3] < -30) arr[i3] = 30;
                if (arr[i3 + 1] > 20) arr[i3 + 1] = -20;
                if (arr[i3 + 1] < -20) arr[i3 + 1] = 20;
            }
            pos.needsUpdate = true;

            // Update lines between nearby particles
            const linePos = state.lines.geometry.attributes.position as THREE.BufferAttribute;
            const lineArr = linePos.array as Float32Array;
            let lineIdx = 0;
            const threshold = 5;

            for (let i = 0; i < Math.min(count, 200); i++) {
                for (let j = i + 1; j < Math.min(count, 200); j++) {
                    const i3 = i * 3;
                    const j3 = j * 3;
                    const dx = arr[i3] - arr[j3];
                    const dy = arr[i3 + 1] - arr[j3 + 1];
                    const dz = arr[i3 + 2] - arr[j3 + 2];
                    const dist = dx * dx + dy * dy + dz * dz;

                    if (dist < threshold * threshold && lineIdx + 6 <= lineArr.length) {
                        lineArr[lineIdx++] = arr[i3];
                        lineArr[lineIdx++] = arr[i3 + 1];
                        lineArr[lineIdx++] = arr[i3 + 2];
                        lineArr[lineIdx++] = arr[j3];
                        lineArr[lineIdx++] = arr[j3 + 1];
                        lineArr[lineIdx++] = arr[j3 + 2];
                    }
                }
            }

            state.lines.geometry.setDrawRange(0, lineIdx / 3);
            linePos.needsUpdate = true;

            // Subtle particle material opacity pulsing
            (state.particles.material as THREE.PointsMaterial).opacity = 0.6 + 0.4 * intensityRef.current;
            (state.lines.material as THREE.LineBasicMaterial).opacity = 0.05 + 0.1 * intensityRef.current;

            state.renderer.render(state.scene, state.camera);
        }

        animate();

        // Resize handler
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
    }, []);

    useEffect(() => {
        intensityRef.current = intensity;
    }, [intensity]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0"
            style={{ background: "linear-gradient(180deg, rgba(8,8,10,0.7) 0%, rgba(15,15,18,0.6) 100%)" }}
        />
    );
}
