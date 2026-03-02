import type { SensorStatus } from "~/data/mock-data";

interface StatusIndicatorProps {
  status: SensorStatus;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

export function StatusIndicator({ status, size = "md" }: StatusIndicatorProps) {
  const color =
    status === "ok"
      ? "bg-emerald-400"
      : status === "warning"
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <span className="relative inline-flex">
      <span className={`${sizeMap[size]} rounded-full ${color}`} />
      {status !== "ok" && (
        <span
          className={`absolute inset-0 rounded-full ${color} opacity-75 animate-ping`}
        />
      )}
    </span>
  );
}
