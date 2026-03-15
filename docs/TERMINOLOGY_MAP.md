# Terminology Map

> **Source of truth:** `lib/ui/terminology.ts`
>
> This file is generated from the TypeScript source. Keep them in sync —
> if you add or change a term, update `lib/ui/terminology.ts` first,
> then regenerate this file or update it manually.

## Terms

| Friendly Label | Canonical Term | Definition | Used In |
|---|---|---|---|
| Impact level | Severity | How critical the incident is, from S0 (catastrophic) to S4 (minor). Determines escalation rules and SLA timers. | Overview, Execute, Context rail |
| Sign-off | Approval | A formal yes/no gate that must be cleared before a sensitive action can proceed. Requires an authorized team member to approve or deny. | Overview, Execute |
| Decision needed | Decision | A question posed during the incident that requires a human choice between predefined options (e.g. rollback vs. hotfix). | Overview, Execute |
| Action item | Task | A discrete unit of work assigned to a responder with a status (Not started → In progress → Done) and optional due time. | Overview, Execute |
| Activity log | Timeline | An append-only record of every significant event during the incident — status changes, notes, escalations, and resolutions. | Overview, Updates |
| Lead responder | IC (Incident Commander) | The person in charge of coordinating the incident response. Has authority to assign tasks, approve actions, and make decisions. | Overview, Context rail |
| Team member | Responder | A person actively working on resolving the incident. Can update tasks assigned to them and add timeline entries. | Context rail |
| Change history | Audit Log | A tamper-resistant record of every action taken in the system — who did what, when, and on which entity. Used for compliance and post-mortems. | Sidebar, Updates |
| Playbook | Runbook | A predefined checklist of steps to follow for a specific type of incident. Can be activated to auto-generate tasks. | Sidebar |
| Not started | TODO | The task has been created but work has not begun. | Execute |
| In progress | IN_PROGRESS | A responder is actively working on this task. | Execute |
| Done | DONE | The task has been completed successfully. | Execute |
| Blocked | SKIPPED | The task cannot proceed due to a dependency or external blocker. | Execute |
| What to do next | Next Steps | The highest-priority tasks that need attention right now — in-progress work first, then upcoming items sorted by urgency. | Overview, Execute |
| Affected systems | Impacted Services | The services, systems, or infrastructure components affected by this incident. | Overview, Context rail |

## How to extend

1. Add a new entry to the `TERMINOLOGY` array in `lib/ui/terminology.ts`
2. Use `term("your_key")` in UI labels for the "Friendly (Canonical)" format
3. Use `<TermTooltip termKey="your_key">` to add definition tooltips
4. Update this document to stay in sync

## UI conventions

- **Panel headings:** Use the friendly label. Example: "Sign-off queue" not "Approvals queue"
- **High-confusion terms:** Wrap in `<TermTooltip>` to show definition on hover
- **Inline references:** Use "Friendly label (Canonical term)" where space permits
- **Glossary modal:** Accessible from the top bar — lists all terms with definitions
