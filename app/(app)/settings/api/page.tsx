import PageShell from "@/app/components/PageShell";

export default function ApiSettingsPage() {
    return (
        <PageShell
            title="API & Webhooks"
            description="Manage API keys, tokens, and webhook endpoints."
            sections={["API Keys", "Webhook Endpoints", "Rate Limits", "Usage & Logs"]}
        />
    );
}
