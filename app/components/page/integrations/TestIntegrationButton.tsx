interface TestIntegrationButtonProps {
    integrationName?: string;
    className?: string;
}

export default function TestIntegrationButton({
    integrationName = "integration",
    className = "",
}: TestIntegrationButtonProps) {
    return (
        <button
            className={`flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] ${className}`}
            aria-label={`Test ${integrationName} connection`}
        >
            <span>⚡</span>
            Test Connection
        </button>
    );
}
