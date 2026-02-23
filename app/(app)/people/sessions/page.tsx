import PageShell from "@/app/components/PageShell";

export default function SessionsPage() {
    return (
        <PageShell
            title="Sessions & Devices"
            description="View active sessions and manage trusted devices."
            sections={["Active Sessions", "Device History", "Revoke Access"]}
        />
    );
}
