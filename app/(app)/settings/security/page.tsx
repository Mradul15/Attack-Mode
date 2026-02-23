import PageShell from "@/app/components/PageShell";

export default function SecuritySettingsPage() {
    return (
        <PageShell
            title="Security Settings"
            description="Configure authentication, SSO, and security policies."
            sections={["Authentication Methods", "SSO Configuration", "Password Policy", "MFA Settings"]}
        />
    );
}
