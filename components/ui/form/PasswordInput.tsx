"use client";

import React, { forwardRef, useState } from "react";
import Input, { InputProps } from "@/components/ui/form/Input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<InputProps, "type" | "rightIcon"> {
  /**
   * If provided, will be used as the aria-label for the toggle button.
   * Defaults to French labels for accessibility.
   */
  toggleAriaLabelOn?: string;
  toggleAriaLabelOff?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      toggleAriaLabelOn = "Masquer le mot de passe",
      toggleAriaLabelOff = "Afficher le mot de passe",
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent form submission if button accidentally inside a form
      e.preventDefault();
      setVisible((v) => !v);
    };

    const rightIcon = (
      <button
        type="button"
        tabIndex={-1}
        onClick={handleToggle}
        aria-label={visible ? toggleAriaLabelOn : toggleAriaLabelOff}
        className="text-gray-400 hover:text-gray-700 focus:outline-none"
      >
        {visible ? (
          // Eye off (closed) icon
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-9a8.96 8.96 0 012.48-5.86M6.6 6.6L3 3m3.6 3.6A9.03 9.03 0 0112 5c5 0 9 4 9 9 0 1.9-.56 3.66-1.53 5.17M17.94 17.94L21 21"
            />
          </svg>
        ) : (
          // Eye (open) icon
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    );

    return (
      <Input
        // force the password input text color to black for readability
        className={cn("!text-black", "pr-10", className)}
        ref={ref}
        type={visible ? "text" : "password"}
        rightIcon={rightIcon}
        {...(props as InputProps)}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
