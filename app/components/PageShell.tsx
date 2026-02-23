interface PageShellProps {
    title: string;
    description?: string;
    sections?: string[];
}

export default function PageShell({ title, description, sections = [] }: PageShellProps) {
    return (
        <div className="page-shell">
            <div className="page-shell__header">
                <h1 className="page-shell__title">{title}</h1>
                {description && <p className="page-shell__description">{description}</p>}
            </div>

            {sections.length > 0 && (
                <div className="page-shell__sections">
                    {sections.map((section) => (
                        <div key={section} className="page-shell__card">
                            <h3 className="page-shell__card-title">{section}</h3>
                            <p className="page-shell__card-placeholder">
                                Placeholder for {section.toLowerCase()} content.
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
