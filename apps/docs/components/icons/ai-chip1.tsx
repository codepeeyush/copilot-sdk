interface AiChip1Props {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

export function AiChip1({
  width = 24,
  height = 24,
  className,
  color = "currentColor",
}: AiChip1Props) {
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
        d="M19.5 6.5a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2z"
        opacity=".4"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity=".2"
        d="M19.5 6.5a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zM8 2v2.5M16 2v2.5m-8 15V22m8-2.5V22M12 4.5V2m0 17.5V22M22 8h-2.5m2.5 8h-2.5m-15-8H2m2.5 8H2m17.5-4H22M4.5 12H2"
      />
      <path
        fill={color}
        d="M16.75 9a.75.75 0 0 0-1.5 0h1.5m-1.5 6a.75.75 0 0 0 1.5 0h-1.5m-5.028-6v-.75a.75.75 0 0 0-.703.49zm.556 0 .703-.26a.75.75 0 0 0-.703-.49zm-3.481 5.74a.75.75 0 0 0 1.406.52L8 15zm5 .52a.75.75 0 0 0 1.406-.52L13 15zM16 9h-.75v6h1.5V9zm-5.778 0v.75h.556v-1.5h-.556zM8 15l.703.26.89-2.4-.704-.26-.703-.26-.89 2.4zm.889-2.4.703.26 1.333-3.6-.703-.26-.703-.26-1.333 3.6zM10.778 9l-.703.26 1.333 3.6.703-.26.703-.26-1.333-3.6zm1.333 3.6-.703.26.889 2.4L13 15l.703-.26-.889-2.4zm-3.222 0v.75h3.222v-1.5H8.89z"
      />
    </svg>
  );
}
