# Validation Rules (v1)

## Common
- All text inputs trimmed
- Max lengths enforced server-side
- Reject HTML input unless explicitly allowed and sanitized

## Incident Fields
- title: required, 3–120 chars, allow letters/numbers/basic punctuation
- description: optional, max 5,000 chars, sanitized markdown only
- severity: required enum {S0,S1,S2,S3,S4}
- impacted_services: optional array, each 1–50 chars, max 20 entries
- tags: optional array, each 1–30 chars, max 20 entries

## Runbook Fields
- name: required, 3–80 chars
- category: required enum {CRED_COMPROMISE,TOKEN_COMPROMISE,DATA_EXFIL,ENDPOINT_COMPROMISE,OTHER}
- task.title: required 3–120 chars
- task.description: optional max 3,000 chars (sanitized)
- due_in_minutes: optional integer 1–10080
- owner_role: required enum {ADMIN,IC,RESPONDER,LEGAL_COMMS,OBSERVER}
- decision.prompt: required max 200 chars
- decision.options: 2–6 options, each 1–60 chars

## Evidence References
- url: allowlist scheme https only
- block private IP ranges and link-local (SSRF mitigation)
- max 2,000 chars per url

## File Uploads (if enabled)
- types allowlist: pdf,png,jpg (no docm, no html)
- max size: 10MB (configurable)