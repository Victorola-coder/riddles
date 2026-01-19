"use client";

import clsx from "clsx";
import { useState } from "react";
import { EyeIcon } from "../svgs";

export default function Input({
  id,
  error,
  placeholder,
  type = "text",
  multiline,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const baseStyles = clsx(
    "w-full p-4 rounded-[12px] font-aloe text-base leading-[22.4px] transition-all duration-300",
    "bg-[var(--bg-secondary)] text-[var(--text-primary)]",
    "placeholder:text-[var(--text-muted)]",
    "border border-[var(--border-default)]",
    "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/50",
    error && "border-red-500 focus:border-red-500 focus:ring-red-500/50"
  );

  return (
    <fieldset>
      <div className="relative">
        {multiline ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            placeholder={placeholder}
            className={baseStyles}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={inputType}
            placeholder={placeholder}
            autoComplete="off"
            className={clsx(baseStyles, "h-full", type === "password" && "pr-12")}
          />
        )}
        {type === "password" && (
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <EyeIcon fill={showPassword ? "currentColor" : "currentColor"} className="opacity-70" />
          </span>
        )}
      </div>
      {error && (
        <p className="text-red-500 font-aloe text-xs leading-[22.4px] mt-1 ml-1">
          {error}
        </p>
      )}
    </fieldset>
  );
}
