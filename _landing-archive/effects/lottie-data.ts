/**
 * Minimal Lottie animation data for landing page integration icons.
 * These are procedurally-defined pulsing/flowing circle animations
 * representing data flow between integrations.
 */

// Pulsing circle animation (represents data flowing)
export const dataFlowAnimation = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 48,
    h: 48,
    nm: "DataFlow",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Pulse",
            sr: 1,
            ks: {
                o: { a: 1, k: [
                    { t: 0, s: [100], e: [40] },
                    { t: 30, s: [40], e: [100] },
                    { t: 60, s: [100] },
                ]},
                s: { a: 1, k: [
                    { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
                    { t: 30, s: [120, 120, 100], e: [100, 100, 100] },
                    { t: 60, s: [100, 100, 100] },
                ]},
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 0, k: 0 },
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                {
                    ty: "el",
                    s: { a: 0, k: [16, 16] },
                    p: { a: 0, k: [0, 0] },
                    nm: "Circle",
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.976, 0.451, 0.086, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 2 },
                    lc: 2,
                    lj: 2,
                    nm: "Stroke",
                },
                {
                    ty: "fl",
                    c: { a: 0, k: [0.976, 0.451, 0.086, 0.15] },
                    o: { a: 0, k: 100 },
                    nm: "Fill",
                },
            ],
            ip: 0,
            op: 60,
            st: 0,
        },
        {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: "Ring",
            sr: 1,
            ks: {
                o: { a: 1, k: [
                    { t: 0, s: [0], e: [60] },
                    { t: 15, s: [60], e: [0] },
                    { t: 30, s: [0], e: [60] },
                    { t: 45, s: [60], e: [0] },
                    { t: 60, s: [0] },
                ]},
                s: { a: 1, k: [
                    { t: 0, s: [80, 80, 100], e: [160, 160, 100] },
                    { t: 30, s: [160, 160, 100], e: [80, 80, 100] },
                    { t: 60, s: [80, 80, 100] },
                ]},
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 0, k: 0 },
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                {
                    ty: "el",
                    s: { a: 0, k: [24, 24] },
                    p: { a: 0, k: [0, 0] },
                    nm: "Ring",
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.976, 0.572, 0.235, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 1.5 },
                    lc: 2,
                    lj: 2,
                    nm: "Stroke",
                },
            ],
            ip: 0,
            op: 60,
            st: 0,
        },
    ],
};

// Checkmark animation (represents approvals/sign-offs)
export const checkmarkAnimation = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 45,
    w: 48,
    h: 48,
    nm: "Checkmark",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Check",
            sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                s: { a: 1, k: [
                    { t: 0, s: [0, 0, 100], e: [110, 110, 100] },
                    { t: 20, s: [110, 110, 100], e: [100, 100, 100] },
                    { t: 30, s: [100, 100, 100] },
                ]},
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 0, k: 0 },
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                {
                    ty: "el",
                    s: { a: 0, k: [28, 28] },
                    p: { a: 0, k: [0, 0] },
                    nm: "Circle",
                },
                {
                    ty: "fl",
                    c: { a: 0, k: [0.133, 0.773, 0.369, 0.2] },
                    o: { a: 0, k: 100 },
                    nm: "Fill",
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.133, 0.773, 0.369, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 2 },
                    lc: 2,
                    lj: 2,
                    nm: "Stroke",
                },
            ],
            ip: 0,
            op: 45,
            st: 0,
        },
    ],
};
