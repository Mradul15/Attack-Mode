import PageShell from "@/app/components/PageShell";

export default function SettingsPage() {
    return (
        <PageShell
            title="Organization Settings"
            description="Manage your organization's profile, preferences, and general configuration."
            sections={["Organization Profile", "Preferences", "Danger Zone"]}
        />
    );
}
