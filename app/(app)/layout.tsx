import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-shell">
            <Sidebar />
            <Topbar />
            <main className="app-shell__main">{children}</main>
        </div>
    );
}
