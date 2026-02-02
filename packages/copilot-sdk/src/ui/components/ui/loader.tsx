import { cn } from "../../lib/utils";

export interface LoaderProps {
  variant?:
    | "dots"
    | "typing"
    | "wave"
    | "terminal"
    | "text-blink"
    | "text-shimmer"
    | "loading-dots";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function DotsLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2",
  };

  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };

  return (
    <div
      className={cn(
        "flex items-center translate-y-[-2px] space-x-1",
        containerSizes[size],
        className,
      )}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary csdk-loader-bounce-dots rounded-full",
            dotSizes[size],
          )}
          style={{
            animationDelay: `${i * 160}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TypingLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2",
  };

  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-1",
        containerSizes[size],
        className,
      )}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary csdk-loader-typing rounded-full",
            dotSizes[size],
          )}
          style={{
            animationDelay: `${i * 250}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function WaveLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const barWidths = {
    sm: "w-0.5",
    md: "w-0.5",
    lg: "w-1",
  };

  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };

  const heights = {
    sm: ["6px", "9px", "12px", "9px", "6px"],
    md: ["8px", "12px", "16px", "12px", "8px"],
    lg: ["10px", "15px", "20px", "15px", "10px"],
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        containerSizes[size],
        className,
      )}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-primary csdk-loader-wave rounded-full",
            barWidths[size],
          )}
          style={{
            animationDelay: `${i * 100}ms`,
            height: heights[size][i],
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TerminalLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const cursorSizes = {
    sm: "h-3 w-1.5",
    md: "h-4 w-2",
    lg: "h-5 w-2.5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-1",
        containerSizes[size],
        className,
      )}
    >
      <span className={cn("text-primary font-mono", textSizes[size])}>
        {">"}
      </span>
      <div className={cn("bg-primary csdk-loader-blink", cursorSizes[size])} />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextBlinkLoader({
  text = "Thinking",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn(
        "csdk-loader-text-blink font-medium",
        textSizes[size],
        className,
      )}
    >
      {text}
    </div>
  );
}

export function TextShimmerLoader({
  text = "Thinking",
  className,
  size = "md",
}: {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn(
        "bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)]",
        "bg-[length:200%_auto] bg-clip-text font-medium text-transparent",
        "csdk-loader-shimmer",
        textSizes[size],
        className,
      )}
    >
      {text}
    </div>
  );
}

export function TextDotsLoader({
  className,
  text = "Thinking",
  size = "md",
}: {
  className?: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={cn("text-primary font-medium", textSizes[size])}>
        {text}
      </span>
      <span className="inline-flex">
        <span
          className="text-primary csdk-loader-loading-dots"
          style={{ animationDelay: "0.2s" }}
        >
          .
        </span>
        <span
          className="text-primary csdk-loader-loading-dots"
          style={{ animationDelay: "0.4s" }}
        >
          .
        </span>
        <span
          className="text-primary csdk-loader-loading-dots"
          style={{ animationDelay: "0.6s" }}
        >
          .
        </span>
      </span>
    </div>
  );
}

function Loader({
  variant = "typing",
  size = "md",
  text,
  className,
}: LoaderProps) {
  switch (variant) {
    case "dots":
      return <DotsLoader size={size} className={className} />;
    case "typing":
      return <TypingLoader size={size} className={className} />;
    case "wave":
      return <WaveLoader size={size} className={className} />;
    case "terminal":
      return <TerminalLoader size={size} className={className} />;
    case "text-blink":
      return <TextBlinkLoader text={text} size={size} className={className} />;
    case "text-shimmer":
      return (
        <TextShimmerLoader text={text} size={size} className={className} />
      );
    case "loading-dots":
      return <TextDotsLoader text={text} size={size} className={className} />;
    default:
      return <TypingLoader size={size} className={className} />;
  }
}

export { Loader };
