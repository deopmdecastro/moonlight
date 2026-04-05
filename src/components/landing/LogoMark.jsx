import React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export default function LogoMark({
  to = "/",
  label = "moonlight",
  className = "",
  showText = true,
  size = "md",
  onClick,
} = {}) {
  const dims = size === "sm" ? { outer: "w-7 h-7", inner: "w-5 h-5" } : { outer: "w-8 h-8", inner: "w-6 h-6" };
  const textClass = size === "sm" ? "text-lg" : "text-xl";

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn("flex items-center gap-2 group min-w-0", className)}
      aria-label={label}
      title={label}
    >
      <div className={cn("relative shrink-0", dims.outer)}>
        <div className="absolute inset-0 rounded-full bg-accent/60" />
        <div className={cn("absolute top-0 right-0 rounded-full bg-primary", dims.inner)} />
      </div>
      {showText ? (
        <span
          className={cn(
            "font-display text-foreground tracking-tight group-hover:text-primary transition-colors truncate",
            textClass
          )}
        >
          {label}
        </span>
      ) : null}
    </Link>
  );
}

