interface AiChatProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

export function AiChat({
  width = 24,
  height = 24,
  className,
  color = "currentColor",
}: AiChatProps) {
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
        d="M14 2.5h-4c-4.418 0-8 3.78-8 8.444V12c0 2.415.96 4.593 2.5 6.132 0 .771-.2 2.524-1 3.368 2.5 0 4.005-1.474 4.005-1.474a7.6 7.6 0 0 0 2.495.418h4c4.418 0 8-3.78 8-8.444v-1.056C22 6.281 18.418 2.5 14 2.5"
        opacity=".4"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14 2.5h-4c-4.418 0-8 3.78-8 8.444V12c0 2.415.96 4.593 2.5 6.132 0 .771-.2 2.524-1 3.368 2.5 0 4.005-1.474 4.005-1.474a7.6 7.6 0 0 0 2.495.418h4c4.418 0 8-3.78 8-8.444v-1.056C22 6.281 18.418 2.5 14 2.5"
      />
      <path
        fill={color}
        d="M16.75 8.5a.75.75 0 0 0-1.5 0h1.5m-1.5 6a.75.75 0 0 0 1.5 0h-1.5m-5.028-6v-.75a.75.75 0 0 0-.703.49zm.556 0 .703-.26a.75.75 0 0 0-.703-.49zm-3.481 5.74a.75.75 0 0 0 1.406.52L8 14.5zm5 .52a.75.75 0 0 0 1.406-.52L13 14.5zM16 8.5h-.75v6h1.5v-6zm-5.778 0v.75h.556v-1.5h-.556zM8 14.5l.703.26.89-2.4-.704-.26-.703-.26-.89 2.4zm.889-2.4.703.26 1.333-3.6-.703-.26-.703-.26-1.333 3.6zm1.889-3.6-.703.26 1.333 3.6.703-.26.703-.26-1.333-3.6zm1.333 3.6-.703.26.889 2.4.703-.26.703-.26-.889-2.4zm-3.222 0v.75h3.222v-1.5H8.89z"
      />
    </svg>
  );
}
