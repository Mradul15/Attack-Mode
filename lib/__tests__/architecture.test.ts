/**
 * Architecture guard tests.
 *
 * These tests verify structural invariants that prevent architectural drift:
 * 1. No file outside the allowed gateway imports lib/mock/* directly
 * 2. ServiceResult contract: errors never throw, always return { ok: false }
 * 3. Store never imports mock repository directly
 * 4. DI container is the only place that chooses the repository impl
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { IncidentService } from "../services/incidentService";
import { mockIncidentRepository } from "../repositories/mockIncidentRepository";
import { hasPermission } from "../auth/permissions";

// ── Helpers ──────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../..");

function walkTs(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules" && entry.name !== ".next") {
            results.push(...walkTs(full));
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
            results.push(full);
        }
    }
    return results;
}

// Files allowed to import @/lib/mock/*
const MOCK_IMPORT_ALLOWLIST = new Set([
    path.resolve(ROOT, "lib/repositories/mockData.ts"),
]);

function isTestFile(filePath: string): boolean {
    return filePath.includes("__tests__") || filePath.endsWith(".test.ts") || filePath.endsWith(".test.tsx");
}

function isInMockDir(filePath: string): boolean {
    return filePath.includes(path.join("lib", "mock"));
}

// ── 1. No direct lib/mock/* imports outside gateway ──────

describe("Import boundary: lib/mock/*", () => {
    it("no file outside mockData.ts and tests imports lib/mock/* (alias or relative)", () => {
        const violations: string[] = [];
        const allFiles = walkTs(ROOT);

        // Matches real import statements only (import/require/dynamic import).
        // Two catch-all patterns cover all depths and forms:
        //   Pattern 1: alias   — @/lib/mock/  in any import form
        //   Pattern 2: relative — any path segment /mock/ or /lib/mock/ at any depth
        const MOCK_IMPORT_PATTERNS = [
            /(?:from|require\(|import\()\s*["']@\/lib\/mock\//,           // alias: @/lib/mock/
            /(?:from|require\(|import\()\s*["'][.\/]*[^"']*\/mock\//,     // any relative containing /mock/
        ];

        for (const filePath of allFiles) {
            if (MOCK_IMPORT_ALLOWLIST.has(filePath)) continue;
            if (isTestFile(filePath)) continue;
            if (isInMockDir(filePath)) continue;

            const content = fs.readFileSync(filePath, "utf-8");
            for (const pattern of MOCK_IMPORT_PATTERNS) {
                if (pattern.test(content)) {
                    violations.push(path.relative(ROOT, filePath));
                    break; // one violation per file is enough
                }
            }
        }

        expect(
            violations,
            `These files import lib/mock/* directly (alias or relative). Use @/lib/repositories/mockData instead:\n  ${violations.join("\n  ")}`,
        ).toEqual([]);
    });
});

// ── 2. Store never imports mock repository directly ──────

describe("Store isolation", () => {
    it("incidentStore.ts does not import mockIncidentRepository or lib/mock/*", () => {
        const storePath = path.resolve(ROOT, "lib/state/incidentStore.ts");
        const content = fs.readFileSync(storePath, "utf-8");

        expect(content).not.toMatch(/mockIncidentRepository/);
        expect(content).not.toMatch(/@\/lib\/mock\//);
    });

    it("incidentStore.ts imports service via container only", () => {
        const storePath = path.resolve(ROOT, "lib/state/incidentStore.ts");
        const content = fs.readFileSync(storePath, "utf-8");

        expect(content).toMatch(/from\s+["']@\/lib\/container["']/);
    });
});

// ── 3. DI container is the single wiring point ───────────

describe("DI container", () => {
    it("container.ts is the only non-repository file that imports mockIncidentRepository", () => {
        const violations: string[] = [];
        const allFiles = walkTs(ROOT);
        const containerPath = path.resolve(ROOT, "lib/container.ts");

        for (const filePath of allFiles) {
            if (filePath === containerPath) continue;
            if (isTestFile(filePath)) continue;
            if (isInMockDir(filePath)) continue;
            // The mockIncidentRepository file itself exports it
            if (filePath.includes("mockIncidentRepository")) continue;
            // Other repository-layer files (mockData gateway, stub) are part of the same package
            if (filePath.includes(path.join("lib", "repositories"))) continue;

            const content = fs.readFileSync(filePath, "utf-8");
            // Match actual imports only, not comment references
            if (/import\s.*mockIncidentRepository/.test(content) || /from\s+['"].*mockIncidentRepository/.test(content)) {
                violations.push(path.relative(ROOT, filePath));
            }
        }

        expect(
            violations,
            `These files import mockIncidentRepository directly (should go through container):\n  ${violations.join("\n  ")}`,
        ).toEqual([]);
    });
});

// ── 4. ServiceResult contract tests ──────────────────────

describe("ServiceResult contract", () => {
    // These tests verify that the service returns discriminated results
    // and never throws for expected business-rule failures.

    const svc = new IncidentService(mockIncidentRepository, hasPermission);

    it("FORBIDDEN does not throw; returns { ok: false, error.code: FORBIDDEN }", async () => {
        const result = await svc.startTask({
            actorId: "usr_4", actorName: "Dan Kim", actorEmail: "dan@acme.com", actorRole: "Observer",
            incidentId: "inc_001", taskId: "tsk_002",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
            expect(typeof result.error.message).toBe("string");
        }
    });

    it("INVALID_TRANSITION does not throw; returns { ok: false, error.code: INVALID_TRANSITION }", async () => {
        const result = await svc.completeTask({
            actorId: "usr_1", actorName: "Alice Chen", actorEmail: "alice@acme.com", actorRole: "Admin",
            incidentId: "inc_001", taskId: "tsk_002", // TODO → DONE is invalid
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_TRANSITION");
            expect(typeof result.error.message).toBe("string");
        }
    });

    it("NOT_FOUND does not throw; returns { ok: false, error.code: NOT_FOUND }", async () => {
        const result = await svc.loadIncident("inc_nonexistent");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("NOT_FOUND");
            expect(typeof result.error.message).toBe("string");
        }
    });

    it("success returns { ok: true, data: T }", async () => {
        const result = await svc.loadIncident("inc_001");
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data).toBeDefined();
            expect(result.data.incident.incident_id).toBe("inc_001");
        }
    });
});

// ── 5. Repository interface has no update/delete for timeline/audit ──

describe("Repository interface shape", () => {
    it("IncidentRepository has appendTimelineEvent (not update/delete)", async () => {
        const typesSource = fs.readFileSync(
            path.resolve(ROOT, "lib/repositories/types.ts"),
            "utf-8",
        );
        expect(typesSource).toMatch(/appendTimelineEvent/);
        expect(typesSource).toMatch(/appendAuditEvent/);
        expect(typesSource).not.toMatch(/updateTimelineEvent/);
        expect(typesSource).not.toMatch(/deleteTimelineEvent/);
        expect(typesSource).not.toMatch(/updateAuditEvent/);
        expect(typesSource).not.toMatch(/deleteAuditEvent/);
    });

    it("IncidentRepository uses getIncidentAggregate (not getAggregate)", () => {
        const typesSource = fs.readFileSync(
            path.resolve(ROOT, "lib/repositories/types.ts"),
            "utf-8",
        );
        expect(typesSource).toMatch(/getIncidentAggregate/);
        expect(typesSource).not.toMatch(/\bgetAggregate\b/);
    });
});
