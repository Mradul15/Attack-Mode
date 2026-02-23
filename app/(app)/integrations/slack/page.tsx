import PageShell from "@/app/components/PageShell";

export default function SlackSettingsPage() {
    return (
        <PageShell
            title="Slack Settings"
            description="Configure your Slack integration for incident notifications and channels."
            sections={["Connection Status", "Channel Mapping", "Notification Rules", "Bot Permissions"]}
        />
    );
}
