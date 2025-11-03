"use client";

import React, { forwardRef, InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

// On retire 'size' de l'interface native
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      size = "md",
      id,
      ...props
    },
    ref,
  ) => {
    // Utilisation de useId pour un id stable
    const reactId = useId();
    const inputId = id || reactId;

    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

    const variantClasses = {
      default:
        "border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      outline: "border-2 border-gray-300 bg-transparent focus:border-blue-500",
      filled:
        "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            id={inputId}
            className={cn(
              "w-full rounded-md transition-colors duration-200 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              size ? sizeClasses[size] : undefined,
              variant ? variantClasses[variant] : undefined,
              leftIcon ? "pl-10" : undefined,
              rightIcon ? "pr-10" : undefined,
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : undefined,
              className,
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
