"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { AuthProvider } from "@/lib/auth/auth-context";
import GlossaryModal from "@/app/components/global/GlossaryModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [glossaryOpen, setGlossaryOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="app-shell">
                <Sidebar />
                <Topbar onOpenGlossary={() => setGlossaryOpen(true)} />
                <main className="app-shell__main">{children}</main>
            </div>
            <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
        </AuthProvider>
    );
}
