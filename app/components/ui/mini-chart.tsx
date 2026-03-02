interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  min?: number;
  max?: number;
}

export function MiniChart({
  data,
  width = 120,
  height = 40,
  color = "var(--color-accent-cyan)",
  min,
  max,
}: MiniChartProps) {
  if (!data.length) return null;

  const lo = min ?? Math.min(...data);
  const hi = max ?? Math.max(...data);
  const range = hi - lo || 1;
  const padX = 2;
  const padY = 4;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * innerW;
    const y = padY + innerH - ((v - lo) / range) * innerH;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${padX + innerW},${padY + innerH} L${padX},${padY + innerH} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
    >
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#grad-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.length > 0 && (
        <circle
          cx={padX + innerW}
          cy={padY + innerH - ((data[data.length - 1] - lo) / range) * innerH}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
}
