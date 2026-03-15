"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

interface EscalationSceneProps {
    progress?: number; // 0-1, scroll-driven
}

const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Ripple distortion
    float wave = sin(pos.x * 3.0 + uTime * 2.0) * cos(pos.y * 2.0 + uTime * 1.5);
    pos.z += wave * 0.3 * uIntensity;

    // Secondary ripple
    float wave2 = sin(pos.x * 5.0 - uTime * 3.0) * sin(pos.y * 4.0 + uTime);
    pos.z += wave2 * 0.15 * uIntensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    // Ripple rings emanating from center
    float dist = distance(vUv, vec2(0.5));
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.5 + 0.5;
    ripple *= smoothstep(0.8, 0.0, dist);

    // Second ripple layer
    float ripple2 = sin(dist * 12.0 + uTime * 2.0) * 0.5 + 0.5;
    ripple2 *= smoothstep(0.6, 0.0, dist);

    // Color — red/orange gradient based on ripple
    vec3 colorA = vec3(0.976, 0.451, 0.086); // orange #f97316
    vec3 colorB = vec3(0.937, 0.267, 0.267); // red #ef4444
    vec3 colorC = vec3(0.392, 0.392, 0.478); // muted

    vec3 color = mix(colorC, colorA, ripple * uIntensity);
    color = mix(color, colorB, ripple2 * uIntensity * 0.6);

    float alpha = (ripple * 0.4 + ripple2 * 0.2) * uIntensity;
    alpha = clamp(alpha, 0.0, 0.6);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function EscalationScene({ progress = 0 }: EscalationSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.OrthographicCamera;
        material: THREE.ShaderMaterial;
        raf: number;
    } | null>(null);
    const progressRef = useRef(progress);

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
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uIntensity: { value: 0 },
            },
            transparent: true,
            depthWrite: false,
        });

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 64, 64),
            material
        );
        scene.add(plane);

        stateRef.current = { renderer, scene, camera, material, raf: 0 };

        const startTime = Date.now();

        function animate() {
            const state = stateRef.current;
            if (!state) return;
            state.raf = requestAnimationFrame(animate);

            const elapsed = (Date.now() - startTime) * 0.001;
            state.material.uniforms.uTime.value = elapsed;
            state.material.uniforms.uIntensity.value = progressRef.current;

            state.renderer.render(state.scene, state.camera);
        }

        animate();

        const onResize = () => {
            if (!container || !stateRef.current) return;
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            stateRef.current.renderer.setSize(nw, nh);
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

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
