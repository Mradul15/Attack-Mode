"use client";

import ExportMenu from "@/app/components/core/ExportMenu";

interface ExportAuditButtonProps {
    className?: string;
}

export default function ExportAuditButton({ className = "" }: ExportAuditButtonProps) {
    return (
        <ExportMenu
            formats={["CSV", "JSON", "PDF"]}
            onExport={(format) => {
                // Placeholder: would trigger audit log export
                console.log(`Exporting audit logs as ${format}`);
            }}
            className={className}
        />
    );
}
