import * as THREE from "three";

export interface ParticleControls {
    convergence: number;   // 0–1: how far particles have moved toward center
    particleFade: number;  // 1–0: particle opacity (fades during flash)
    glow: number;          // 0–1: radial background glow intensity
    burst: number;         // 0–1: explosion outward from center after flash
}

interface ParticleData {
    initialPositions: Float32Array;
    targetPositions: Float32Array;
    delays: Float32Array;
    sizes: Float32Array;
}

const PARTICLE_COUNT = 150;
const COLORS = [
    new THREE.Color(0xf97316), // orange-500
    new THREE.Color(0xfb923c), // orange-400
    new THREE.Color(0xffba86), // light orange
    new THREE.Color(0xffffff), // white
    new THREE.Color(0xef4444), // red-500
];

export class ParticleField {
    readonly points: THREE.Points;
    readonly controls: ParticleControls = { convergence: 0, particleFade: 1, glow: 0, burst: 0 };

    private material: THREE.ShaderMaterial;
    private data: ParticleData;
    private startTime: number;

    constructor(scene: THREE.Scene) {
        this.startTime = performance.now();

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const initialPositions = new Float32Array(PARTICLE_COUNT * 3);
        const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const delays = new Float32Array(PARTICLE_COUNT);
        const sizes = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 4 + Math.random() * 6;

            const ix = Math.cos(angle) * Math.sin(phi) * radius;
            const iy = Math.sin(angle) * Math.sin(phi) * radius;
            const iz = (Math.random() - 0.5) * 2;

            initialPositions[i * 3] = ix;
            initialPositions[i * 3 + 1] = iy;
            initialPositions[i * 3 + 2] = iz;

            positions[i * 3] = ix;
            positions[i * 3 + 1] = iy;
            positions[i * 3 + 2] = iz;

            // Target: near center with slight scatter
            targetPositions[i * 3] = (Math.random() - 0.5) * 0.6;
            targetPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
            targetPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            delays[i] = Math.random() * 0.8;
            sizes[i] = 1.5 + Math.random() * 3;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("aInitial", new THREE.BufferAttribute(initialPositions, 3));
        geometry.setAttribute("aTarget", new THREE.BufferAttribute(targetPositions, 3));
        geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
        geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

        this.data = { initialPositions, targetPositions, delays, sizes };

        this.material = new THREE.ShaderMaterial({
            vertexShader: `
                attribute vec3 aInitial;
                attribute vec3 aTarget;
                attribute vec3 aColor;
                attribute float aDelay;
                attribute float aSize;

                uniform float uTime;
                uniform float uConvergence;
                uniform float uParticleFade;
                uniform float uBurst;

                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float t = uTime - aDelay;
                    float appear = clamp(t / 0.4, 0.0, 1.0);

                    // Ease convergence per-particle with delay offset
                    float conv = clamp((uConvergence - aDelay * 0.3) / 0.7, 0.0, 1.0);
                    float easedConv = 1.0 - pow(1.0 - conv, 3.0); // easeOutCubic

                    vec3 pos = mix(aInitial, aTarget, easedConv);

                    // Wobble that diminishes as particles converge
                    float wobble = (1.0 - easedConv) * 0.3;
                    pos.x += sin(uTime * 2.0 + aDelay * 20.0) * wobble;
                    pos.y += cos(uTime * 1.7 + aDelay * 15.0) * wobble;

                    // Gentle orbital drift after convergence
                    float orbit = easedConv * 0.5;
                    pos.x += cos(uTime * 0.8 + aDelay * 6.28) * orbit * 0.3;
                    pos.y += sin(uTime * 0.6 + aDelay * 6.28) * orbit * 0.2;

                    // Burst explosion — particles fly outward from center
                    if (uBurst > 0.0) {
                        // Each particle gets a unique outward direction based on its initial angle
                        vec3 burstDir = normalize(aInitial + vec3(0.001));
                        float burstDist = uBurst * (3.0 + aDelay * 5.0);
                        // Ease: fast start, decelerating
                        float burstEase = 1.0 - pow(1.0 - uBurst, 2.0);
                        pos = aTarget + burstDir * burstEase * burstDist;
                        // Add slight spiral during burst
                        float spiralAngle = uBurst * 3.0 + aDelay * 6.28;
                        pos.x += sin(spiralAngle) * burstEase * 0.4;
                        pos.y += cos(spiralAngle) * burstEase * 0.3;
                    }

                    vColor = aColor;
                    vAlpha = appear * uParticleFade;

                    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                    // Particles grow slightly during burst for more visual impact
                    float sizeBoost = 1.0 + uBurst * 1.5;
                    gl_PointSize = aSize * sizeBoost * (300.0 / -mvPos.z);
                    gl_Position = projectionMatrix * mvPos;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    // Soft circle with glow falloff
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float core = smoothstep(0.5, 0.1, dist);
                    float glow = smoothstep(0.5, 0.0, dist) * 0.4;
                    float alpha = (core + glow) * vAlpha;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            uniforms: {
                uTime: { value: 0 },
                uConvergence: { value: 0 },
                uParticleFade: { value: 1 },
                uBurst: { value: 0 },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.points = new THREE.Points(geometry, this.material);
        scene.add(this.points);
    }

    update(elapsed: number): void {
        const t = elapsed * 0.001; // seconds
        this.material.uniforms.uTime.value = t;
        this.material.uniforms.uConvergence.value = this.controls.convergence;
        this.material.uniforms.uParticleFade.value = this.controls.particleFade;
        this.material.uniforms.uBurst.value = this.controls.burst;
    }

    dispose(): void {
        this.points.geometry.dispose();
        this.material.dispose();
        this.points.removeFromParent();
    }
}
