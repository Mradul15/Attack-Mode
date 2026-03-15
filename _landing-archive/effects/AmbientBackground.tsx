"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";

/**
 * Cursor-reactive starfield/particle ambient background.
 * Persists behind the entire app for a living, operational feel.
 */
export default function AmbientBackground() {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const warmLayerRef = useRef<HTMLDivElement>(null);
    const coolLayerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const modeRef = useRef(pathname === "/" ? 1 : 0);

    useEffect(() => {
        const isMarketingRoute = pathname === "/";
        const targetWarm = isMarketingRoute ? 1 : 0.18;
        const targetCool = isMarketingRoute ? 0.38 : 0.78;

        // CSS transitions handle the smooth opacity change (0.8s ease on the elements)
        if (warmLayerRef.current) warmLayerRef.current.style.opacity = String(targetWarm);
        if (coolLayerRef.current) coolLayerRef.current.style.opacity = String(targetCool);

        modeRef.current = isMarketingRoute ? 1 : 0;
    }, [pathname]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.inset = "0";
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
        camera.position.z = 50;

        // Starfield particles
        const starCount = 400;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const palette = [
            new THREE.Color("#f97316"),
            new THREE.Color("#64647a"),
            new THREE.Color("#3b82f6"),
            new THREE.Color("#a0a0b0"),
        ];

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 120;
            positions[i3 + 1] = (Math.random() - 0.5) * 80;
            positions[i3 + 2] = (Math.random() - 0.5) * 60 - 20;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = 0.08 + Math.random() * 0.12;
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const stars = new THREE.Points(geom, mat);
        scene.add(stars);

        let raf = 0;
        const startTime = Date.now();

        function animate() {
            raf = requestAnimationFrame(animate);
            const elapsed = (Date.now() - startTime) * 0.001;
            const mode = modeRef.current;

            // Slow ambient drift
            stars.rotation.y = elapsed * (0.018 + mode * 0.01);
            stars.rotation.x = elapsed * (0.008 + mode * 0.005);

            // Cursor-reactive parallax — subtle camera offset
            const targetX = mouseRef.current.x * 2;
            const targetY = mouseRef.current.y * 2;
            camera.position.x += (targetX - camera.position.x) * 0.02;
            camera.position.y += (targetY - camera.position.y) * 0.02;
            camera.position.z = 50 - mode * 3;

            // Subtle opacity pulse
            mat.opacity = 0.24 + mode * 0.16 + Math.sin(elapsed * (0.42 + mode * 0.2)) * 0.08;

            renderer.render(scene, camera);
        }

        animate();

        // Track cursor
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouseMove);

        const onResize = () => {
            const nw = window.innerWidth;
            const nh = window.innerHeight;
            renderer.setSize(nw, nh);
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
        >
            <div
                ref={warmLayerRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: pathname === "/" ? 1 : 0.18,
                    background:
                        "radial-gradient(circle at 50% 10%, rgba(157, 40, 18, 0.34), transparent 42%), radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.14), transparent 28%)",
                    transition: "opacity 0.8s ease",
                }}
            />
            <div
                ref={coolLayerRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: pathname === "/" ? 0.38 : 0.78,
                    background:
                        "radial-gradient(circle at 70% 20%, rgba(59, 130, 246, 0.18), transparent 38%), radial-gradient(circle at 50% 80%, rgba(111, 140, 184, 0.14), transparent 44%)",
                    transition: "opacity 0.8s ease",
                }}
            />
        </div>
    );
}
