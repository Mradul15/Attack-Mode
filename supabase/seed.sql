-- ============================================================
-- Seed data — mirrors lib/mock/*.ts exactly
-- ============================================================

-- Users (auth_uid is NULL for seed data — will be linked when users sign up)
INSERT INTO users (user_id, name, email, role, org_id) VALUES
    ('usr_1', 'Alice Chen', 'alice@acme.com', 'Admin', 'org_acme'),
    ('usr_2', 'Bob Park', 'bob@acme.com', 'IC', 'org_acme'),
    ('usr_3', 'Carol Wu', 'carol@acme.com', 'Responder', 'org_acme'),
    ('usr_4', 'Dan Kim', 'dan@acme.com', 'Observer', 'org_acme'),
    ('usr_5', 'Eve Robinson', 'eve@acme.com', 'Legal/Comms', 'org_acme');

-- Incidents
INSERT INTO incidents (incident_id, title, description, severity, status, ic_user_id, responder_ids, impacted_services, tags, created_at, updated_at, resolved_at, duration) VALUES
    ('inc_001', 'Suspicious OAuth tokens detected', 'Multiple OAuth tokens generated from an unusual geo-location. Possible credential compromise.', 'S1', 'ACTIVE', 'usr_2', ARRAY['usr_3','usr_1'], ARRAY['Auth','API Gateway'], ARRAY['security','oauth'], '2026-02-25T14:10:00Z', '2026-02-25T14:45:00Z', NULL, '35m'),
    ('inc_002', 'Database cluster failover', 'Primary database node unresponsive, automatic failover triggered. Read replicas experiencing elevated latency.', 'S0', 'INVESTIGATING', 'usr_1', ARRAY['usr_2','usr_3'], ARRAY['Database','API','Web App'], ARRAY['infrastructure','database'], '2026-02-25T13:30:00Z', '2026-02-25T14:50:00Z', NULL, '1h 20m'),
    ('inc_003', 'CDN cache invalidation failure', 'Stale assets being served from multiple edge locations after a deploy.', 'S2', 'MONITORING', 'usr_2', ARRAY['usr_3'], ARRAY['CDN','Web App'], ARRAY['cdn','deployment'], '2026-02-25T12:00:00Z', '2026-02-25T13:15:00Z', NULL, '1h 15m'),
    ('inc_004', 'Auth service memory leak', 'Memory usage steadily increasing on auth service pods. OOM kills observed after 12h uptime.', 'S1', 'RESOLVED', 'usr_1', ARRAY['usr_2','usr_3'], ARRAY['Auth'], ARRAY['memory','auth'], '2026-02-24T09:20:00Z', '2026-02-24T13:05:00Z', '2026-02-24T13:05:00Z', '3h 45m'),
    ('inc_005', 'Scheduled maintenance window', 'Planned maintenance for network infrastructure upgrade.', 'S4', 'CLOSED', 'usr_2', ARRAY[]::TEXT[], ARRAY['Network'], ARRAY['maintenance','planned'], '2026-02-23T02:00:00Z', '2026-02-23T04:00:00Z', '2026-02-23T04:00:00Z', '2h');

-- Task instances
INSERT INTO task_instances (task_id, incident_id, title, status, assignee_id, due_in_minutes, created_at, updated_at) VALUES
    ('tsk_001', 'inc_001', 'Revoke compromised OAuth tokens', 'IN_PROGRESS', 'usr_3', 15, '2026-02-25T14:12:00Z', '2026-02-25T14:40:00Z'),
    ('tsk_002', 'inc_001', 'Audit token generation logs', 'TODO', 'usr_1', 30, '2026-02-25T14:12:00Z', '2026-02-25T14:12:00Z'),
    ('tsk_003', 'inc_001', 'Notify affected service owners', 'TODO', 'usr_2', NULL, '2026-02-25T14:15:00Z', '2026-02-25T14:15:00Z'),
    ('tsk_004', 'inc_001', 'Enable enhanced logging on auth service', 'DONE', 'usr_3', NULL, '2026-02-25T14:11:00Z', '2026-02-25T14:25:00Z'),
    ('tsk_005', 'inc_002', 'Check upstream service health', 'TODO', 'usr_3', 15, '2026-02-25T13:32:00Z', '2026-02-25T13:32:00Z'),
    ('tsk_006', 'inc_002', 'Restart primary database cluster', 'IN_PROGRESS', 'usr_1', 5, '2026-02-25T13:35:00Z', '2026-02-25T14:40:00Z'),
    ('tsk_007', 'inc_002', 'Verify replication lag on read replicas', 'DONE', 'usr_2', NULL, '2026-02-25T13:33:00Z', '2026-02-25T14:00:00Z'),
    ('tsk_008', 'inc_002', 'Notify affected customers', 'TODO', 'usr_2', NULL, '2026-02-25T13:40:00Z', '2026-02-25T13:40:00Z'),
    ('tsk_009', 'inc_002', 'Draft customer communication', 'TODO', 'usr_5', NULL, '2026-02-25T13:45:00Z', '2026-02-25T13:45:00Z'),
    ('tsk_010', 'inc_002', 'Isolate failing pods', 'DONE', 'usr_3', NULL, '2026-02-25T13:31:00Z', '2026-02-25T13:50:00Z');

-- Approvals
INSERT INTO approvals (approval_id, incident_id, title, requester_id, status, approved_by, created_at, resolved_at) VALUES
    ('apr_001', 'inc_001', 'Deploy token revocation hotfix to production', 'usr_3', 'PENDING', NULL, '2026-02-25T14:30:00Z', NULL),
    ('apr_002', 'inc_001', 'Grant break-glass access to auth DB', 'usr_2', 'PENDING', NULL, '2026-02-25T14:35:00Z', NULL),
    ('apr_003', 'inc_002', 'Scale up API replicas to 20', 'usr_3', 'APPROVED', 'usr_1', '2026-02-25T13:45:00Z', '2026-02-25T13:50:00Z'),
    ('apr_004', 'inc_002', 'Approve customer notification draft', 'usr_5', 'PENDING', NULL, '2026-02-25T14:00:00Z', NULL);

-- Decisions
INSERT INTO decisions (decision_id, incident_id, prompt, options, requester_id, response, responded_by, created_at, responded_at) VALUES
    ('dec_001', 'inc_001', 'Should we rotate all OAuth client secrets?', ARRAY['Rotate all now','Rotate only compromised','Defer to post-mortem'], 'usr_2', NULL, NULL, '2026-02-25T14:25:00Z', NULL),
    ('dec_002', 'inc_002', 'Should we failover to the secondary region?', ARRAY['Yes — failover now','Attempt local repair first','Escalate to VP Eng'], 'usr_1', NULL, NULL, '2026-02-25T13:40:00Z', NULL),
    ('dec_003', 'inc_002', 'Approve customer notification draft?', ARRAY['Approve & Send','Request Changes','Defer'], 'usr_5', 'Approve & Send', 'usr_1', '2026-02-25T14:15:00Z', '2026-02-25T14:20:00Z');

-- Timeline events
INSERT INTO timeline_events (event_id, incident_id, type, actor_id, actor_name, message, created_at) VALUES
    ('evt_001', 'inc_001', 'escalation', 'usr_2', 'Bob Park', 'Incident created — Suspicious OAuth tokens detected', '2026-02-25T14:10:00Z'),
    ('evt_002', 'inc_001', 'action', 'usr_3', 'Carol Wu', 'Enabled enhanced logging on auth service', '2026-02-25T14:15:00Z'),
    ('evt_003', 'inc_001', 'message', 'usr_1', 'Alice Chen', 'Seeing 47 tokens generated from anomalous IP range 203.x.x.x', '2026-02-25T14:20:00Z'),
    ('evt_004', 'inc_001', 'action', 'usr_3', 'Carol Wu', 'Started revoking compromised tokens — batch 1 of 3', '2026-02-25T14:30:00Z'),
    ('evt_005', 'inc_001', 'status_change', 'usr_2', 'Bob Park', 'Status changed to ACTIVE — confirmed credential compromise', '2026-02-25T14:35:00Z'),
    ('evt_010', 'inc_002', 'escalation', 'usr_1', 'Alice Chen', 'Incident escalated to S0 — primary DB unresponsive', '2026-02-25T13:30:00Z'),
    ('evt_011', 'inc_002', 'action', 'usr_3', 'Carol Wu', 'Isolating failing pods from load balancer', '2026-02-25T13:35:00Z'),
    ('evt_012', 'inc_002', 'message', 'usr_2', 'Bob Park', 'Replication lag on read replicas is within acceptable range', '2026-02-25T14:00:00Z'),
    ('evt_013', 'inc_002', 'status_change', 'usr_1', 'Alice Chen', 'Status changed from MONITORING to INVESTIGATING', '2026-02-25T14:10:00Z'),
    ('evt_014', 'inc_002', 'action', 'usr_1', 'Alice Chen', 'Initiated primary node restart with failover flag', '2026-02-25T14:30:00Z');

-- Audit events
INSERT INTO audit_events (log_id, action, actor_id, actor_email, target, ip_address, request_id, metadata, created_at) VALUES
    ('log_001', 'user.login', 'usr_1', 'alice@acme.com', 'session:sess_abc123', '192.168.1.42', 'req_a1b2c3', '{"method":"SSO"}'::jsonb, '2026-02-25T14:32:00Z'),
    ('log_002', 'incident.create', 'usr_2', 'bob@acme.com', 'incident:inc_001', '10.0.1.15', 'req_d4e5f6', '{"severity":"S1","title":"Suspicious OAuth tokens detected"}'::jsonb, '2026-02-25T14:10:00Z'),
    ('log_003', 'user.role.update', 'usr_1', 'alice@acme.com', 'user:carol@acme.com', '192.168.1.42', 'req_g7h8i9', '{"role_from":"Observer","role_to":"Responder"}'::jsonb, '2026-02-25T13:55:00Z'),
    ('log_004', 'api_key.create', 'usr_1', 'alice@acme.com', 'key:ak_prod_xxx', '192.168.1.42', 'req_j0k1l2', '{"scope":"read:incidents"}'::jsonb, '2026-02-25T12:00:00Z'),
    ('log_005', 'runbook.publish', 'usr_2', 'bob@acme.com', 'runbook:rb_001', '10.0.1.15', 'req_m3n4o5', '{"version":"3.0"}'::jsonb, '2026-02-25T11:20:00Z'),
    ('log_006', 'incident.resolve', 'usr_1', 'alice@acme.com', 'incident:inc_004', '192.168.1.42', 'req_p6q7r8', '{"duration":"3h 45m"}'::jsonb, '2026-02-24T13:05:00Z'),
    ('log_007', 'integration.rotate', 'usr_1', 'alice@acme.com', 'integration:int_slack', '192.168.1.42', 'req_s9t0u1', '{"integration":"Slack"}'::jsonb, '2026-02-24T10:00:00Z'),
    ('log_008', 'user.invite', 'usr_1', 'alice@acme.com', 'user:newuser@acme.com', '192.168.1.42', 'req_v2w3x4', '{"role":"Observer"}'::jsonb, '2026-02-23T16:00:00Z');

-- Runbook templates
INSERT INTO runbook_templates (runbook_id, name, description, category, status, version, tasks, author_id, created_at, updated_at) VALUES
    ('rb_001', 'Credential Compromise Response', 'Standard procedure for responding to compromised credentials or tokens.', 'CRED_COMPROMISE', 'PUBLISHED', '3.0',
     '[{"task_id":"rbt_001","title":"Identify compromised credentials","owner_role":"IC","due_in_minutes":15,"order":1},{"task_id":"rbt_002","title":"Revoke affected tokens/keys","owner_role":"Responder","due_in_minutes":30,"order":2},{"task_id":"rbt_003","title":"Audit access logs for abuse","owner_role":"Responder","due_in_minutes":60,"order":3},{"task_id":"rbt_004","title":"Notify affected users","owner_role":"Legal/Comms","due_in_minutes":120,"order":4},{"task_id":"rbt_005","title":"Implement rotation policy","owner_role":"Admin","order":5}]'::jsonb,
     'usr_1', '2026-01-10T10:00:00Z', '2026-02-15T14:30:00Z'),
    ('rb_002', 'Database Failover Procedure', 'Steps to safely failover primary database to secondary replica.', 'OTHER', 'PUBLISHED', '2.1',
     '[{"task_id":"rbt_010","title":"Verify replication status","owner_role":"Responder","due_in_minutes":5,"order":1},{"task_id":"rbt_011","title":"Promote secondary to primary","owner_role":"IC","due_in_minutes":10,"order":2},{"task_id":"rbt_012","title":"Update connection strings","owner_role":"Responder","due_in_minutes":15,"order":3},{"task_id":"rbt_013","title":"Validate application connectivity","owner_role":"Responder","due_in_minutes":30,"order":4}]'::jsonb,
     'usr_2', '2025-11-05T08:00:00Z', '2026-01-20T16:00:00Z'),
    ('rb_003', 'API Token Compromise', 'Response playbook for compromised API keys or service tokens.', 'TOKEN_COMPROMISE', 'DRAFT', '1.0',
     '[{"task_id":"rbt_020","title":"Identify exposed token scope","owner_role":"IC","due_in_minutes":10,"order":1},{"task_id":"rbt_021","title":"Rotate affected API keys","owner_role":"Admin","due_in_minutes":20,"order":2},{"task_id":"rbt_022","title":"Review API access logs","owner_role":"Responder","due_in_minutes":60,"order":3}]'::jsonb,
     'usr_1', '2026-02-01T12:00:00Z', '2026-02-20T09:00:00Z'),
    ('rb_004', 'Data Exfiltration Response', 'Playbook for suspected or confirmed data exfiltration events.', 'DATA_EXFIL', 'PUBLISHED', '1.2',
     '[{"task_id":"rbt_030","title":"Isolate affected systems","owner_role":"IC","due_in_minutes":5,"order":1},{"task_id":"rbt_031","title":"Capture forensic evidence","owner_role":"Responder","due_in_minutes":30,"order":2},{"task_id":"rbt_032","title":"Assess data scope and sensitivity","owner_role":"IC","due_in_minutes":60,"order":3},{"task_id":"rbt_033","title":"Engage legal counsel","owner_role":"Legal/Comms","due_in_minutes":120,"order":4},{"task_id":"rbt_034","title":"Prepare regulatory notification","owner_role":"Legal/Comms","order":5}]'::jsonb,
     'usr_2', '2025-12-15T10:00:00Z', '2026-02-10T11:00:00Z'),
    ('rb_005', 'Endpoint Compromise Triage', 'Initial triage steps for a compromised endpoint or workstation.', 'ENDPOINT_COMPROMISE', 'DRAFT', '0.5',
     '[{"task_id":"rbt_040","title":"Isolate endpoint from network","owner_role":"Responder","due_in_minutes":5,"order":1},{"task_id":"rbt_041","title":"Collect endpoint telemetry","owner_role":"Responder","due_in_minutes":15,"order":2}]'::jsonb,
     'usr_3', '2026-02-18T14:00:00Z', '2026-02-22T10:00:00Z');

-- Integrations
INSERT INTO integrations (integration_id, name, description, health, last_sync, icon, scopes) VALUES
    ('int_slack', 'Slack', 'Channel creation, notifications, and bot commands', 'connected', '2m ago', '💬', ARRAY['channels:read','channels:write','users:read','chat:write']),
    ('int_jira', 'Jira', 'Ticket creation and status syncing', 'connected', '5m ago', '🎫', ARRAY['read:jira-work','write:jira-work']),
    ('int_pagerduty', 'PagerDuty', 'On-call scheduling and escalation policies', 'connected', '10m ago', '📟', ARRAY['read','write','escalation_policies']),
    ('int_datadog', 'Datadog', 'Monitoring dashboards and alert triggers', 'degraded', '1h ago', '📊', ARRAY['dashboards:read','monitors:read','events:write']),
    ('int_github', 'GitHub', 'Pull requests and deployment tracking', 'connected', '3m ago', '🐙', ARRAY['repo:read','deployments:read']),
    ('int_statuspage', 'Statuspage', 'Public status page updates', 'disconnected', NULL, '📢', ARRAY[]::TEXT[]);
