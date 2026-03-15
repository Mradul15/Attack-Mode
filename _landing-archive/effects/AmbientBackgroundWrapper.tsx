"use client";

import dynamic from "next/dynamic";

const AmbientBackground = dynamic(
    () => import("./AmbientBackground"),
    { ssr: false }
);

export default function AmbientBackgroundWrapper() {
    return <AmbientBackground />;
}
