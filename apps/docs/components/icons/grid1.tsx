interface Grid1Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

export function Grid1({
  width = 24,
  height = 24,
  className,
  color = "currentColor",
}: Grid1Props) {
  return (
    <svg
      width={width}
      height={height}
      fill={color}
      className={className}
      role="img"
      viewBox="0 0 24 24"
    >
      <path
        fill={color}
        d="M9 3H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1M20 14h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1"
        opacity=".4"
      />
      <path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 3H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1ZM20 3h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1ZM9 14H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM20 14h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Z"
      />
    </svg>
  );
}
