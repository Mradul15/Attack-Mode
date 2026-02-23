import PageShell from "@/app/components/PageShell";

export default function CreateIncidentPage() {
    return (
        <PageShell
            title="Create Incident"
            description="Launch a new incident response workflow."
            sections={["Incident Details", "Severity & Impact", "Assign Responders", "Linked Runbook"]}
        />
    );
}
