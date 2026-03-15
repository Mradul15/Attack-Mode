-- ============================================================
-- Attack Mode App — Initial Schema
-- ============================================================

-- Users (profiles linked to Supabase Auth)
CREATE TABLE users (
    user_id   TEXT PRIMARY KEY,
    auth_uid  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name      TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    role      TEXT NOT NULL DEFAULT 'Observer'
              CHECK (role IN ('Admin', 'IC', 'Responder', 'Observer', 'Legal/Comms')),
    avatar_url TEXT,
    org_id    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Incidents
CREATE TABLE incidents (
    incident_id       TEXT PRIMARY KEY,
    title             TEXT NOT NULL,
    description       TEXT,
    severity          TEXT NOT NULL CHECK (severity IN ('S0','S1','S2','S3','S4')),
    status            TEXT NOT NULL DEFAULT 'ACTIVE'
                      CHECK (status IN ('ACTIVE','INVESTIGATING','MONITORING','RESOLVED','CLOSED')),
    ic_user_id        TEXT NOT NULL REFERENCES users(user_id),
    responder_ids     TEXT[] NOT NULL DEFAULT '{}',
    impacted_services TEXT[] NOT NULL DEFAULT '{}',
    tags              TEXT[] NOT NULL DEFAULT '{}',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at       TIMESTAMPTZ,
    duration          TEXT
);

-- Task instances (per-incident)
CREATE TABLE task_instances (
    task_id        TEXT PRIMARY KEY,
    incident_id    TEXT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    title          TEXT NOT NULL,
    description    TEXT,
    status         TEXT NOT NULL DEFAULT 'TODO'
                   CHECK (status IN ('TODO','IN_PROGRESS','DONE','SKIPPED')),
    assignee_id    TEXT NOT NULL REFERENCES users(user_id),
    due_in_minutes INTEGER,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tasks_incident ON task_instances(incident_id);

-- Approvals
CREATE TABLE approvals (
    approval_id  TEXT PRIMARY KEY,
    incident_id  TEXT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    requester_id TEXT NOT NULL REFERENCES users(user_id),
    status       TEXT NOT NULL DEFAULT 'PENDING'
                 CHECK (status IN ('PENDING','APPROVED','DENIED')),
    approved_by  TEXT REFERENCES users(user_id),
    reason       TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at  TIMESTAMPTZ
);
CREATE INDEX idx_approvals_incident ON approvals(incident_id);

-- Decisions
CREATE TABLE decisions (
    decision_id   TEXT PRIMARY KEY,
    incident_id   TEXT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    prompt        TEXT NOT NULL,
    options       TEXT[] NOT NULL DEFAULT '{}',
    requester_id  TEXT NOT NULL REFERENCES users(user_id),
    response      TEXT,
    responded_by  TEXT REFERENCES users(user_id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at  TIMESTAMPTZ
);
CREATE INDEX idx_decisions_incident ON decisions(incident_id);

-- Timeline events (append-only)
CREATE TABLE timeline_events (
    event_id    TEXT PRIMARY KEY,
    incident_id TEXT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('status_change','message','action','escalation','resolution')),
    actor_id    TEXT NOT NULL,
    actor_name  TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_timeline_incident ON timeline_events(incident_id);

-- Audit events (append-only)
CREATE TABLE audit_events (
    log_id      TEXT PRIMARY KEY,
    action      TEXT NOT NULL,
    actor_id    TEXT NOT NULL,
    actor_email TEXT NOT NULL,
    target      TEXT NOT NULL,
    ip_address  TEXT NOT NULL DEFAULT '0.0.0.0',
    request_id  TEXT NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_action ON audit_events(action);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);

-- Runbook templates
CREATE TABLE runbook_templates (
    runbook_id  TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    category    TEXT NOT NULL CHECK (category IN ('CRED_COMPROMISE','TOKEN_COMPROMISE','DATA_EXFIL','ENDPOINT_COMPROMISE','OTHER')),
    status      TEXT NOT NULL DEFAULT 'DRAFT'
                CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
    version     TEXT NOT NULL DEFAULT '1.0',
    tasks       JSONB NOT NULL DEFAULT '[]',
    author_id   TEXT NOT NULL REFERENCES users(user_id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Integrations
CREATE TABLE integrations (
    integration_id TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    description    TEXT NOT NULL DEFAULT '',
    health         TEXT NOT NULL DEFAULT 'disconnected'
                   CHECK (health IN ('connected','degraded','disconnected')),
    last_sync      TEXT,
    icon           TEXT NOT NULL DEFAULT '',
    scopes         TEXT[] NOT NULL DEFAULT '{}'
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE runbook_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users full access.
-- Tenant isolation and fine-grained RLS can be added later.
CREATE POLICY "Authenticated users can read all" ON users
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert users" ON users
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update users" ON users
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated access incidents" ON incidents
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access tasks" ON task_instances
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access approvals" ON approvals
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access decisions" ON decisions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access timeline" ON timeline_events
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access audit" ON audit_events
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access runbooks" ON runbook_templates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated access integrations" ON integrations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow anon key for initial development (service role bypass)
CREATE POLICY "Anon access users" ON users FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access incidents" ON incidents FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access tasks" ON task_instances FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access approvals" ON approvals FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access decisions" ON decisions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access timeline" ON timeline_events FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access audit" ON audit_events FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access runbooks" ON runbook_templates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access integrations" ON integrations FOR ALL TO anon USING (true) WITH CHECK (true);
