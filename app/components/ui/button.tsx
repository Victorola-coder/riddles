import clsx from "clsx";

export default function Button(props: ButtonProps) {
  const {
    loading,
    noDefault,
    className,
    onClick,
    children,
    disabled,
    size = "default",
    variant = "default",
    ...prop
  } = props;

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(
        !noDefault &&
          "transition-all duration-300 active:scale-[0.99] font-medium leading-normal font-aloeMed disabled:cursor-not-allowed disabled:opacity-60",
        {
          "px-[21px] py-[10px] text-[18px]": size === "default",
          "px-3 py-2 text-sm": size === "sm",
          "px-6 py-3 text-lg": size === "lg",
          
          // Primary Gradient (Purple)
          "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-dark)] rounded-[10px] text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30":
            variant === "default" || variant === "primary",
            
          // Secondary (White/Light)
          "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-[16px] hover:bg-[var(--bg-secondary)]": 
            variant === "secondary",
            
          // Danger (Red)
          "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20":
            variant === "danger",
            
          // Google/Neutral
          "bg-[var(--bg-secondary)] rounded-[12px] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-card-hover)]": 
            variant === "google",
            
          // Ghost
          "bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]": 
            variant === "ghost",
            
          // Outline
          "bg-transparent border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]": 
            variant === "outline",
        },
        className
      )}
      aria-busy={loading ? "true" : "false"}
      {...prop}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
