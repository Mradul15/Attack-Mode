"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { ParticleField, ParticleControls } from "./systems/ParticleField";

export interface IntroCanvasControls {
    particles: ParticleControls;
    ripple: { strength: number; radius: number };
    shake: number;
}

const IntroCanvas = forwardRef<IntroCanvasControls, object>(function IntroCanvas(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        particleField: ParticleField;
        glowMaterial: THREE.ShaderMaterial;
        rippleMaterial: THREE.ShaderMaterial;
        renderTarget: THREE.WebGLRenderTarget;
        raf: number;
        startTime: number;
    } | null>(null);

    const controlsRef = useRef<IntroCanvasControls>({
        particles: { convergence: 0, particleFade: 1, glow: 0, burst: 0 },
        ripple: { strength: 0, radius: 0 },
        shake: 0,
    });

    useImperativeHandle(ref, () => controlsRef.current, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const w = container.clientWidth;
        const h = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio, 2);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
        });
        renderer.setSize(w, h);
        renderer.setPixelRatio(dpr);
        renderer.setClearColor(0x050a14, 1);
        container.appendChild(renderer.domElement);

        // Main scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
        camera.position.z = 8;

        // Particle field
        const particleField = new ParticleField(scene);

        // Background glow — fullscreen quad behind particles
        const glowMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position.xy, -0.999, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uGlow;
                uniform vec2 uResolution;
                varying vec2 vUv;

                void main() {
                    vec2 center = vec2(0.5);
                    float dist = distance(vUv, center);

                    vec3 bg = vec3(0.02, 0.027, 0.05);
                    vec3 glowColor = vec3(0.976, 0.451, 0.086);
                    float glowFalloff = smoothstep(0.6, 0.0, dist);
                    float glowStrength = glowFalloff * uGlow * 0.35;

                    float vignette = 1.0 - smoothstep(0.3, 0.85, dist) * 0.6;

                    vec3 color = bg + glowColor * glowStrength;
                    color *= vignette;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            uniforms: {
                uGlow: { value: 0 },
                uResolution: { value: new THREE.Vector2(w, h) },
            },
            depthTest: false,
            depthWrite: false,
        });
        const glowQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glowMaterial);
        glowQuad.renderOrder = -1;
        glowQuad.frustumCulled = false;
        scene.add(glowQuad);

        // Connection lines geometry — drawn between nearby particles
        const maxLines = 200;
        const linePositions = new Float32Array(maxLines * 6);
        const lineGeom = new THREE.BufferGeometry();
        lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        lineGeom.setDrawRange(0, 0);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xf97316,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const lines = new THREE.LineSegments(lineGeom, lineMaterial);
        scene.add(lines);

        // Render target for post-process ripple
        const renderTarget = new THREE.WebGLRenderTarget(w * dpr, h * dpr);

        // Post-process ripple — fullscreen quad
        const rippleMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position.xy, 0.0, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float uRippleStrength;
                uniform float uRippleRadius;
                uniform vec2 uRippleCenter;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    vec2 delta = uv - uRippleCenter;
                    float dist = length(delta);

                    float ringWidth = 0.08;
                    float ring = smoothstep(uRippleRadius - ringWidth, uRippleRadius, dist)
                               - smoothstep(uRippleRadius, uRippleRadius + ringWidth, dist);

                    vec2 dir = normalize(delta + vec2(0.0001));
                    float distortion = ring * uRippleStrength * 0.04;
                    uv += dir * distortion;

                    float ring2 = smoothstep(uRippleRadius * 0.6 - ringWidth * 0.5, uRippleRadius * 0.6, dist)
                                - smoothstep(uRippleRadius * 0.6, uRippleRadius * 0.6 + ringWidth * 0.5, dist);
                    uv += dir * ring2 * uRippleStrength * 0.015;

                    gl_FragColor = texture2D(tDiffuse, uv);
                }
            `,
            uniforms: {
                tDiffuse: { value: renderTarget.texture },
                uRippleStrength: { value: 0 },
                uRippleRadius: { value: 0 },
                uRippleCenter: { value: new THREE.Vector2(0.5, 0.5) },
            },
            depthTest: false,
            depthWrite: false,
        });

        // Post-process scene
        const postScene = new THREE.Scene();
        const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), rippleMaterial);
        postScene.add(postQuad);

        const startTime = performance.now();
        stateRef.current = {
            renderer, scene, camera, particleField,
            glowMaterial, rippleMaterial, renderTarget,
            raf: 0, startTime,
        };

        function animate() {
            const state = stateRef.current;
            if (!state) return;
            state.raf = requestAnimationFrame(animate);

            const elapsed = performance.now() - state.startTime;
            const ctrl = controlsRef.current;

            // Update particle field
            state.particleField.controls.convergence = ctrl.particles.convergence;
            state.particleField.controls.particleFade = ctrl.particles.particleFade;
            state.particleField.controls.glow = ctrl.particles.glow;
            state.particleField.controls.burst = ctrl.particles.burst;
            state.particleField.update(elapsed);

            // Update glow
            state.glowMaterial.uniforms.uGlow.value = ctrl.particles.glow;

            // Update connection lines
            updateLines(state.particleField.points, lines, linePositions, ctrl.particles.convergence);
            lineMaterial.opacity = 0.08 * (1 - ctrl.particles.convergence * 0.6) * ctrl.particles.particleFade;

            // Camera shake
            const shakeAmt = ctrl.shake;
            if (shakeAmt > 0.01) {
                const t = elapsed * 0.001;
                state.camera.position.x = Math.sin(t * 25) * shakeAmt * 0.06;
                state.camera.position.y = Math.cos(t * 20) * shakeAmt * 0.04;
            } else {
                state.camera.position.x = 0;
                state.camera.position.y = 0;
            }

            // Render pass 1: scene → renderTarget
            state.renderer.setRenderTarget(state.renderTarget);
            state.renderer.render(state.scene, state.camera);

            // Render pass 2: post-process ripple → screen
            state.rippleMaterial.uniforms.uRippleStrength.value = ctrl.ripple.strength;
            state.rippleMaterial.uniforms.uRippleRadius.value = ctrl.ripple.radius;
            state.renderer.setRenderTarget(null);
            state.renderer.render(postScene, postCamera);
        }

        animate();

        const onResize = () => {
            if (!container || !stateRef.current) return;
            const nw = container.clientWidth;
            const nh = container.clientHeight;
            const ndpr = Math.min(window.devicePixelRatio, 2);
            stateRef.current.renderer.setSize(nw, nh);
            stateRef.current.renderer.setPixelRatio(ndpr);
            stateRef.current.camera.aspect = nw / nh;
            stateRef.current.camera.updateProjectionMatrix();
            stateRef.current.renderTarget.setSize(nw * ndpr, nh * ndpr);
            stateRef.current.glowMaterial.uniforms.uResolution.value.set(nw, nh);
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (stateRef.current) {
                cancelAnimationFrame(stateRef.current.raf);
                stateRef.current.particleField.dispose();
                stateRef.current.renderTarget.dispose();
                stateRef.current.glowMaterial.dispose();
                stateRef.current.rippleMaterial.dispose();
                stateRef.current.renderer.dispose();
                stateRef.current.renderer.domElement.remove();
                stateRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
        />
    );
});

const PARTICLE_COUNT = 150;

function updateLines(
    points: THREE.Points,
    lines: THREE.LineSegments,
    linePositions: Float32Array,
    convergence: number,
): void {
    const posAttr = points.geometry.getAttribute("aInitial") as THREE.BufferAttribute;
    const targetAttr = points.geometry.getAttribute("aTarget") as THREE.BufferAttribute;
    const delayAttr = points.geometry.getAttribute("aDelay") as THREE.BufferAttribute;

    // Only draw lines when particles are mid-flight (not fully converged)
    if (convergence > 0.9) {
        lines.geometry.setDrawRange(0, 0);
        return;
    }

    const threshold = 2.5 - convergence * 1.5;
    let lineIndex = 0;
    const maxLines = 200;

    for (let i = 0; i < PARTICLE_COUNT && lineIndex < maxLines; i++) {
        const conv_i = Math.max(0, Math.min(1, (convergence - delayAttr.array[i] * 0.3) / 0.7));
        const ease_i = 1 - Math.pow(1 - conv_i, 3);
        const ix = posAttr.array[i * 3] + (targetAttr.array[i * 3] - posAttr.array[i * 3]) * ease_i;
        const iy = posAttr.array[i * 3 + 1] + (targetAttr.array[i * 3 + 1] - posAttr.array[i * 3 + 1]) * ease_i;
        const iz = posAttr.array[i * 3 + 2] + (targetAttr.array[i * 3 + 2] - posAttr.array[i * 3 + 2]) * ease_i;

        for (let j = i + 1; j < PARTICLE_COUNT && lineIndex < maxLines; j++) {
            const conv_j = Math.max(0, Math.min(1, (convergence - delayAttr.array[j] * 0.3) / 0.7));
            const ease_j = 1 - Math.pow(1 - conv_j, 3);
            const jx = posAttr.array[j * 3] + (targetAttr.array[j * 3] - posAttr.array[j * 3]) * ease_j;
            const jy = posAttr.array[j * 3 + 1] + (targetAttr.array[j * 3 + 1] - posAttr.array[j * 3 + 1]) * ease_j;
            const jz = posAttr.array[j * 3 + 2] + (targetAttr.array[j * 3 + 2] - posAttr.array[j * 3 + 2]) * ease_j;

            const dx = ix - jx;
            const dy = iy - jy;
            const dz = iz - jz;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < threshold * threshold) {
                linePositions[lineIndex * 6] = ix;
                linePositions[lineIndex * 6 + 1] = iy;
                linePositions[lineIndex * 6 + 2] = iz;
                linePositions[lineIndex * 6 + 3] = jx;
                linePositions[lineIndex * 6 + 4] = jy;
                linePositions[lineIndex * 6 + 5] = jz;
                lineIndex++;
            }
        }
    }

    (lines.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    lines.geometry.setDrawRange(0, lineIndex * 2);
}

export default IntroCanvas;
