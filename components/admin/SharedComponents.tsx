"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  color,
  bgColor = "bg-white",
}) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-sm border`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {change !== undefined && change !== 0 && (
          <div
            className={`flex items-center mt-1 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="text-sm">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-full bg-white">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "w-96",
    md: "w-1/2",
    lg: "w-3/4",
    xl: "w-4/5 max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={`relative top-20 mx-auto p-5 border ${sizeClasses[size]} shadow-lg rounded-md bg-white`}>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => (
  <div className="text-center py-12">
    {Icon && (
      <div className="mx-auto h-12 w-12 text-gray-400">
        <Icon className="h-12 w-12" />
      </div>
    )}
    <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
    {action && (
      <div className="mt-6">
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          {action.label}
        </button>
      </div>
    )}
  </div>
);

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "text-blue-600",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${color}`}
      />
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  colorMap = {},
}) => {
  const defaultColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    suspended: "bg-red-100 text-red-800",
    refunded: "bg-orange-100 text-orange-800",
  };

  const color = colorMap[status] || defaultColors[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};
