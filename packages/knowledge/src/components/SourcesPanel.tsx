"use client";

import React from "react";
import type { Source } from "@yourgpt/copilot-sdk-core";

/**
 * SourcesPanel props
 */
export interface SourcesPanelProps {
  /** Sources to display */
  sources: Source[];
  /** Panel title */
  title?: string;
  /** Show relevance scores */
  showScores?: boolean;
  /** Maximum sources to show */
  maxSources?: number;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Called when a source is clicked */
  onSourceClick?: (source: Source) => void;
}

/**
 * Component to display knowledge base sources/citations
 *
 * @example
 * ```tsx
 * const { sources } = useKnowledgeBase({ apiKey: '...', botId: '...' });
 *
 * <SourcesPanel
 *   sources={sources}
 *   title="Sources"
 *   showScores={true}
 * />
 * ```
 */
export function SourcesPanel({
  sources,
  title = "Sources",
  showScores = false,
  maxSources,
  className,
  style,
  onSourceClick,
}: SourcesPanelProps) {
  if (sources.length === 0) {
    return null;
  }

  const displaySources = maxSources ? sources.slice(0, maxSources) : sources;

  return (
    <div className={className} style={{ ...defaultStyles.container, ...style }}>
      <h4 style={defaultStyles.title}>{title}</h4>
      <div style={defaultStyles.list}>
        {displaySources.map((source, index) => (
          <SourceItem
            key={source.id || index}
            source={source}
            showScore={showScores}
            onClick={onSourceClick}
          />
        ))}
      </div>
      {maxSources && sources.length > maxSources && (
        <div style={defaultStyles.more}>
          +{sources.length - maxSources} more sources
        </div>
      )}
    </div>
  );
}

/**
 * Single source item
 */
interface SourceItemProps {
  source: Source;
  showScore?: boolean;
  onClick?: (source: Source) => void;
}

function SourceItem({ source, showScore, onClick }: SourceItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(source);
    } else if (source.url) {
      window.open(source.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={defaultStyles.item}
      title={source.content}
    >
      <span style={defaultStyles.icon}>📄</span>
      <span style={defaultStyles.itemTitle}>{source.title}</span>
      {showScore && source.score !== undefined && (
        <span style={defaultStyles.score}>
          {Math.round(source.score * 100)}%
        </span>
      )}
    </button>
  );
}

/**
 * Default styles (can be overridden via className or style props)
 */
const defaultStyles: Record<string, React.CSSProperties> = {
  container: {
    padding: "12px 16px",
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
  },
  title: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    margin: "0 0 8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    fontSize: "13px",
    color: "#1f2937",
    transition: "background-color 0.2s",
  },
  icon: {
    fontSize: "14px",
  },
  itemTitle: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  score: {
    fontSize: "11px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  more: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
    textAlign: "center",
  },
};
