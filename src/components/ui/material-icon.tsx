export function MaterialIcon({
  name,
  size = 24,
  className = "",
  filled = false,
}: {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
        data-icon={name}
      data-filled={filled || undefined}
      style={{ fontSize: size }}
      aria-hidden="true"
      />
  );
}
