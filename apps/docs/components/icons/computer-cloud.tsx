interface ComputerCloudProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

export function ComputerCloud({
  width = 24,
  height = 24,
  className,
  color = "currentColor",
}: ComputerCloudProps) {
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
        fillRule="evenodd"
        d="M20 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-8 4a2 2 0 0 0-2 2h-.5a2 2 0 1 0 0 4h5a2 2 0 1 0 0-4H14a2 2 0 0 0-2-2"
        clipRule="evenodd"
        opacity=".4"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14 21h2m-2 0a1.5 1.5 0 0 1-1.5-1.5V17H12m2 4h-4m0 0H8m2 0a1.5 1.5 0 0 0 1.5-1.5V17h.5m0 0v4M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14 9a2 2 0 1 0-4 0h-.5a2 2 0 1 0 0 4h5a2 2 0 1 0 0-4z"
      />
    </svg>
  );
}
