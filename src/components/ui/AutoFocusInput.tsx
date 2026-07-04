"use client";

import { useEffect, useRef } from "react";
import { Input, type InputProps } from "@/components/ui/input";

interface Props extends InputProps {
  /** Refocus when this value changes (e.g. next question index). */
  focusKey?: string | number;
}

export function AutoFocusInput({ focusKey, disabled, ...props }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (disabled) return;
    const frame = requestAnimationFrame(() => {
      ref.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [focusKey, disabled]);

  return <Input ref={ref} disabled={disabled} {...props} />;
}
