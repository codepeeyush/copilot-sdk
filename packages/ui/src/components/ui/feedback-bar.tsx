import { cn } from "../../lib/utils";

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

type FeedbackBarProps = {
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  onHelpful?: () => void;
  onNotHelpful?: () => void;
  onClose?: () => void;
};

export function FeedbackBar({
  className,
  title,
  icon,
  onHelpful,
  onNotHelpful,
  onClose,
}: FeedbackBarProps) {
  return (
    <div
      className={cn(
        "bg-background border-border inline-flex rounded-[12px] border text-sm",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center justify-start gap-4 py-3 pl-4">
          {icon}
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <div className="flex items-center justify-center gap-0.5 px-3 py-0">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
            aria-label="Helpful"
            onClick={onHelpful}
          >
            <ThumbsUpIcon className="size-4" />
          </button>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
            aria-label="Not helpful"
            onClick={onNotHelpful}
          >
            <ThumbsDownIcon className="size-4" />
          </button>
        </div>
        <div className="border-border flex items-center justify-center border-l">
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-md p-3"
            aria-label="Close"
          >
            <XIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
