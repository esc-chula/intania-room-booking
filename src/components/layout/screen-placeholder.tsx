type ScreenPlaceholderProps = {
  title: string;
  design?: string[];
  epics: string;
  sprint0?: boolean;
};

// Stands in for a screen nobody has built yet. Delete it from the page when you start the screen.
export function ScreenPlaceholder({
  title,
  design = [],
  epics,
  sprint0,
}: ScreenPlaceholderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary">{title}</h1>
      <dl className="max-w-2xl space-y-3 rounded-lg border bg-card p-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Status</dt>
          <dd>Not built yet{sprint0 ? " (Sprint 0 scope)" : ""}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Requirements</dt>
          <dd>{epics}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Design</dt>
          <dd>
            {design.length > 0 ? (
              design.map((file) => (
                <code key={file} className="block break-all">
                  designs/{file}
                </code>
              ))
            ) : (
              <span>No frame yet, see docs/open-questions.md</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
