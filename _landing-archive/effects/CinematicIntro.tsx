"use client";

import { useRef, useEffect, useState } from "react";

interface CinematicIntroProps {
    onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [done, setDone] = useState(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    // Lock scroll while intro plays
    useEffect(() => {
        if (done) return;
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [done]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = container.clientWidth;
        const h = container.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        // Particle system — converging towards center
        const particleCount = 180;
        const particles: {
            x: number;
            y: number;
            targetX: number;
            targetY: number;
            vx: number;
            vy: number;
            size: number;
            alpha: number;
            color: string;
            delay: number;
        }[] = [];

        const cx = w / 2;
        const cy = h / 2;
        const colors = ["rgb(249,115,22)", "rgb(251,146,60)", "rgb(255,186,134)", "rgb(255,255,255)", "rgb(239,68,68)"];

        function colorWithAlpha(rgb: string, alpha: number): string {
            return rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
        }

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 400 + Math.random() * 600;
            particles.push({
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                targetX: cx + (Math.random() - 0.5) * 60,
                targetY: cy + (Math.random() - 0.5) * 40,
                vx: 0,
                vy: 0,
                size: 1 + Math.random() * 3,
                alpha: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 800,
            });
        }

        let raf: number;
        let cancelled = false;

        // Theatre.js sequence values — driven by the sheet
        const seq = {
            convergence: 0,    // 0-1: how much particles have converged
            glowRadius: 0,     // 0-1: radial glow intensity
            textReveal: 0,     // 0-1: text appearance
            flashIntensity: 0, // 0-1: white flash
            shakeAmount: 0,    // 0-1: screen shake
            particleFade: 1,   // 1-0: particles fade during flash
        };

        let theatreCleanup: (() => void) | null = null;

        function finish() {
            if (cancelled) return;
            cancelled = true;
            cancelAnimationFrame(raf);
            setDone(true);
            onCompleteRef.current();
        }

        // Theatre.js enhances the animation if its state has real keyframes.
        // Procedural timing always runs as the primary driver.
        // Theatre.js can only override if it produces non-default values
        // (i.e. convergence actually rises above 0 during playback).
        let theatreActive = false;

        const theatreReady = import("@theatre/core").then(async (theatre) => {
            if (cancelled) return;

            const projectState = (await import("./cinematic-intro-state.json")).default;
            const project = theatre.getProject("CinematicIntro", { state: projectState });
            const sheet = project.sheet("Intro Sequence");

            const introObj = sheet.object("intro", {
                convergence: theatre.types.number(0, { range: [0, 1] }),
                glowRadius: theatre.types.number(0, { range: [0, 1] }),
                textReveal: theatre.types.number(0, { range: [0, 1] }),
                flashIntensity: theatre.types.number(0, { range: [0, 1] }),
                shakeAmount: theatre.types.number(0, { range: [0, 1] }),
                particleFade: theatre.types.number(1, { range: [0, 1] }),
            });

            let callCount = 0;
            const unsub = introObj.onValuesChange((values) => {
                callCount++;
                // Skip the first callback (initial defaults) — only trust
                // subsequent updates that show actual keyframe interpolation
                if (callCount > 1 && values.convergence > 0) {
                    theatreActive = true;
                    seq.convergence = values.convergence;
                    seq.glowRadius = values.glowRadius;
                    seq.textReveal = values.textReveal;
                    seq.flashIntensity = values.flashIntensity;
                    seq.shakeAmount = values.shakeAmount;
                    seq.particleFade = values.particleFade;
                }
            });

            await project.ready;
            if (cancelled) { unsub(); return; }

            // Play — but do NOT call finish() from here.
            // Procedural timing handles completion to avoid instant-resolve bugs.
            sheet.sequence.play({ iterationCount: 1, range: [0, 4.8] });

            theatreCleanup = () => { unsub(); };
        }).catch(() => null);

        const startTime = Date.now();

        function animate() {
            if (cancelled) return;
            raf = requestAnimationFrame(animate);

            const elapsed = Date.now() - startTime;

            // Procedural timing is always the primary driver.
            // If Theatre.js is active with real keyframes, it overrides seq values
            // via onValuesChange — but we still need procedural for completion.
            if (!theatreActive) {
                const CONVERGE = 1800;
                const TEXT_START = 2400;
                const FLASH_START = 4000;

                seq.convergence = Math.min(1, elapsed / CONVERGE);
                seq.glowRadius = Math.min(1, elapsed / 3000);
                seq.textReveal = elapsed > TEXT_START ? Math.min(1, (elapsed - TEXT_START) / 800) : 0;
                seq.flashIntensity = elapsed > FLASH_START ? Math.min(1, (elapsed - FLASH_START) / 600) : 0;
                seq.shakeAmount = elapsed > 3200 ? Math.min(1, (elapsed - 3200) / 800) : 0;
                seq.particleFade = elapsed > FLASH_START ? Math.max(0, 1 - (elapsed - FLASH_START) / 600) : 1;
            }

            // Completion at 4.8s regardless of driver
            if (elapsed > 4800) {
                finish();
                return;
            }

            ctx!.clearRect(0, 0, w, h);

            // Background — deep dark
            ctx!.fillStyle = "#05070d";
            ctx!.fillRect(0, 0, w, h);

            // Screen shake
            const shakeX = seq.shakeAmount > 0 ? (Math.random() - 0.5) * seq.shakeAmount * 6 : 0;
            const shakeY = seq.shakeAmount > 0 ? (Math.random() - 0.5) * seq.shakeAmount * 4 : 0;
            ctx!.save();
            ctx!.translate(shakeX, shakeY);

            // Radial glow that builds
            const glowR = seq.glowRadius;
            if (glowR > 0) {
                const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 300 * glowR);
                gradient.addColorStop(0, `rgba(249, 115, 22, ${0.18 * glowR})`);
                gradient.addColorStop(0.5, `rgba(249, 115, 22, ${0.06 * glowR})`);
                gradient.addColorStop(1, "transparent");
                ctx!.fillStyle = gradient;
                ctx!.fillRect(0, 0, w, h);
            }

            // Draw and update particles
            const conv = seq.convergence;
            const ease = 1 - Math.pow(1 - conv, 3); // easeOutCubic

            for (const p of particles) {
                const particleElapsed = Math.max(0, elapsed - p.delay);
                if (particleElapsed <= 0) continue;

                const particleConv = Math.min(1, particleElapsed / 1800) * conv;
                const pEase = 1 - Math.pow(1 - particleConv, 3);

                p.x += (p.targetX - p.x) * pEase * 0.06;
                p.y += (p.targetY - p.y) * pEase * 0.06;
                p.alpha = Math.min(1, particleElapsed / 400) * seq.particleFade;

                // Trail
                const trailLen = Math.min(20, (1 - ease) * 40);
                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 2 && trailLen > 2) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const trailGrad = ctx!.createLinearGradient(
                        p.x, p.y,
                        p.x - nx * trailLen, p.y - ny * trailLen,
                    );
                    trailGrad.addColorStop(0, colorWithAlpha(p.color, p.alpha * 0.6));
                    trailGrad.addColorStop(1, "rgba(0,0,0,0)");

                    ctx!.beginPath();
                    ctx!.moveTo(p.x, p.y);
                    ctx!.lineTo(p.x - nx * trailLen, p.y - ny * trailLen);
                    ctx!.strokeStyle = colorWithAlpha(p.color, p.alpha * 0.4);
                    ctx!.lineWidth = p.size * 0.6;
                    ctx!.stroke();
                }

                ctx!.beginPath();
                ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx!.fillStyle = colorWithAlpha(p.color, p.alpha);
                ctx!.fill();
            }

            // Text reveal phase
            const textR = seq.textReveal;
            if (textR > 0) {
                const textEase = 1 - Math.pow(1 - textR, 4);
                const textFade = Math.max(0, 1 - seq.flashIntensity * 1.2);

                ctx!.save();
                ctx!.textAlign = "center";
                ctx!.textBaseline = "middle";

                // Logo mark
                const markAlpha = textEase * textFade;
                ctx!.font = `bold ${32 + textEase * 8}px system-ui, -apple-system, sans-serif`;
                ctx!.fillStyle = `rgba(249, 115, 22, ${markAlpha})`;
                ctx!.fillText("⚡", cx, cy - 38 + (1 - textEase) * 20);

                // Title
                ctx!.font = `800 ${28 + textEase * 6}px system-ui, -apple-system, sans-serif`;
                ctx!.fillStyle = `rgba(255, 255, 255, ${markAlpha * 0.95})`;
                ctx!.letterSpacing = "0.12em";
                ctx!.fillText("ATTACK MODE", cx, cy + 10 + (1 - textEase) * 30);

                // Subtitle
                const subAlpha = Math.max(0, (textEase - 0.3) / 0.7) * textFade;
                ctx!.font = `400 14px system-ui, -apple-system, sans-serif`;
                ctx!.fillStyle = `rgba(255, 255, 255, ${subAlpha * 0.6})`;
                ctx!.fillText("Chaos to command", cx, cy + 48 + (1 - textEase) * 20);

                ctx!.restore();
            }

            ctx!.restore(); // undo shake transform

            // White flash (drawn after restoring shake for full-screen coverage)
            if (seq.flashIntensity > 0) {
                const flashAlpha = seq.flashIntensity < 0.3
                    ? seq.flashIntensity / 0.3 * 0.85
                    : Math.max(0, 0.85 * (1 - (seq.flashIntensity - 0.3) / 0.7));
                ctx!.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
                ctx!.fillRect(0, 0, w, h);
            }
        }

        animate();

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            theatreReady.then(() => theatreCleanup?.());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (done) return null;

    return (
        <div
            ref={containerRef}
            className="cinematic-intro"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "#05070d",
            }}
        >
            <canvas
                ref={canvasRef}
            />
        </div>
    );
}
