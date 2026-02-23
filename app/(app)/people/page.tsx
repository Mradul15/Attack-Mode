import PageShell from "@/app/components/PageShell";

export default function PeoplePage() {
    return (
        <PageShell
            title="People & Access"
            description="Manage users and team members in your organization."
            sections={["Users Table", "Invite Users", "Teams"]}
        />
    );
}
