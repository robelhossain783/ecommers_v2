"use client";

import React from "react";

interface RyorLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export default function RyorLogo({
  className = "",
  size = "md",
  variant = "dark",
}: RyorLogoProps) {
  const heightMap: Record<"sm" | "md" | "lg", string> = {
    sm: "28px",
    md: "36px",
    lg: "46px",
  };

  const fontSizeMap: Record<"sm" | "md" | "lg", string> = {
    sm: "22px",
    md: "28px",
    lg: "36px",
  };

  const textColor = variant === "light" ? "#FFFFFF" : "#222222";

  return (
    <div
      className={`ryor-logo-container ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: heightMap[size],
        userSelect: "none",
        textDecoration: "none",
      }}
    >
      {/* Brand Text Only: RYOR */}
      <span
        style={{
          fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
          fontSize: fontSizeMap[size],
          fontWeight: 900,
          letterSpacing: "3.5px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ color: textColor }}>RY</span>
        <span
          style={{
            background: "linear-gradient(135deg, #D4BC97 0%, #C5A880 60%, #9E825A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          OR
        </span>
      </span>
    </div>
  );
}
