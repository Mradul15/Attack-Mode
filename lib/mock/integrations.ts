import type { Integration } from "@/lib/types";

export const mockIntegrations: Integration[] = [
    { integration_id: "int_slack", name: "Slack", description: "Channel creation, notifications, and bot commands", health: "connected", last_sync: "2m ago", icon: "💬", scopes: ["channels:read", "channels:write", "users:read", "chat:write"] },
    { integration_id: "int_jira", name: "Jira", description: "Ticket creation and status syncing", health: "connected", last_sync: "5m ago", icon: "🎫", scopes: ["read:jira-work", "write:jira-work"] },
    { integration_id: "int_pagerduty", name: "PagerDuty", description: "On-call scheduling and escalation policies", health: "connected", last_sync: "10m ago", icon: "📟", scopes: ["read", "write", "escalation_policies"] },
    { integration_id: "int_datadog", name: "Datadog", description: "Monitoring dashboards and alert triggers", health: "degraded", last_sync: "1h ago", icon: "📊", scopes: ["dashboards:read", "monitors:read", "events:write"] },
    { integration_id: "int_github", name: "GitHub", description: "Pull requests and deployment tracking", health: "connected", last_sync: "3m ago", icon: "🐙", scopes: ["repo:read", "deployments:read"] },
    { integration_id: "int_statuspage", name: "Statuspage", description: "Public status page updates", health: "disconnected", icon: "📢", scopes: [] },
];
