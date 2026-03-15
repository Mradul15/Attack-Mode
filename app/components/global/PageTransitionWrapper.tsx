"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const PageTransition = dynamic(() => import("./PageTransition"), { ssr: false });

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
    return <PageTransition>{children}</PageTransition>;
}
