import clsx from "clsx";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-[var(--bg-secondary)]/50",
        className
      )}
      {...props}
    />
  );
}
