'use client';

import React from 'react';

interface SalesIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

const SalesIllustration: React.FC<SalesIllustrationProps> = ({
  className = '',
  width = 400,
  height = 300,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="400" height="300" fill="#f8fafc" rx="8" />

      {/* Store Counter */}
      <rect x="50" y="180" width="300" height="80" fill="#374151" rx="4" />
      <rect x="60" y="190" width="280" height="60" fill="#4b5563" rx="2" />

      {/* Cash Register */}
      <rect x="200" y="160" width="80" height="40" fill="#1f2937" rx="6" />
      <rect x="210" y="170" width="60" height="20" fill="#065f46" rx="2" />
      <circle cx="290" cy="180" r="8" fill="#10b981" />
      <circle cx="290" cy="180" r="4" fill="#ffffff" />

      {/* Shelves */}
      <rect x="80" y="60" width="240" height="100" fill="#e5e7eb" rx="4" />

      {/* Beverages on shelves */}
      {/* Bottles */}
      <rect x="90" y="80" width="12" height="30" fill="#3b82f6" rx="6" />
      <rect x="110" y="80" width="12" height="30" fill="#ef4444" rx="6" />
      <rect x="130" y="80" width="12" height="30" fill="#10b981" rx="6" />
      <rect x="150" y="80" width="12" height="30" fill="#f59e0b" rx="6" />

      {/* Cans */}
      <rect x="200" y="85" width="10" height="20" fill="#8b5cf6" rx="2" />
      <rect x="215" y="85" width="10" height="20" fill="#06b6d4" rx="2" />
      <rect x="230" y="85" width="10" height="20" fill="#84cc16" rx="2" />

      {/* Food items */}
      <rect x="260" y="80" width="20" height="15" fill="#f97316" rx="3" />
      <rect x="285" y="80" width="20" height="15" fill="#eab308" rx="3" />

      {/* Second shelf */}
      <rect x="90" y="120" width="12" height="30" fill="#6366f1" rx="6" />
      <rect x="110" y="120" width="12" height="30" fill="#ec4899" rx="6" />
      <rect x="130" y="120" width="12" height="30" fill="#14b8a6" rx="6" />

      <rect x="200" y="125" width="10" height="20" fill="#a855f7" rx="2" />
      <rect x="215" y="125" width="10" height="20" fill="#0ea5e9" rx="2" />

      <rect x="260" y="120" width="20" height="15" fill="#dc2626" rx="3" />
      <rect x="285" y="120" width="20" height="15" fill="#16a34a" rx="3" />

      {/* Shopping Cart */}
      <g transform="translate(330, 200)">
        <rect x="0" y="15" width="30" height="20" fill="none" stroke="#6b7280" strokeWidth="2" rx="2" />
        <circle cx="8" cy="40" r="4" fill="#6b7280" />
        <circle cx="22" cy="40" r="4" fill="#6b7280" />
        <line x1="-5" y1="15" x2="0" y2="15" stroke="#6b7280" strokeWidth="2" />
        <line x1="-8" y1="10" x2="-5" y2="15" stroke="#6b7280" strokeWidth="2" />
      </g>

      {/* Price Tags */}
      <rect x="95" y="110" width="20" height="8" fill="#fbbf24" rx="1" />
      <text x="105" y="116" fontSize="6" fill="#92400e" textAnchor="middle">500 F</text>

      <rect x="205" y="110" width="20" height="8" fill="#fbbf24" rx="1" />
      <text x="215" y="116" fontSize="6" fill="#92400e" textAnchor="middle">300 F</text>

      {/* Money/Receipt */}
      <rect x="220" y="200" width="40" height="25" fill="#ffffff" stroke="#d1d5db" strokeWidth="1" rx="2" />
      <line x1="225" y1="205" x2="255" y2="205" stroke="#9ca3af" strokeWidth="1" />
      <line x1="225" y1="210" x2="250" y2="210" stroke="#9ca3af" strokeWidth="1" />
      <line x1="225" y1="215" x2="245" y2="215" stroke="#9ca3af" strokeWidth="1" />
      <line x1="225" y1="220" x2="255" y2="220" stroke="#9ca3af" strokeWidth="1" />

      {/* Sales Graph Icon */}
      <g transform="translate(120, 30)">
        <rect x="0" y="20" width="4" height="10" fill="#10b981" />
        <rect x="8" y="15" width="4" height="15" fill="#3b82f6" />
        <rect x="16" y="10" width="4" height="20" fill="#f59e0b" />
        <rect x="24" y="5" width="4" height="25" fill="#ef4444" />
        <polyline points="2,25 10,20 18,15 26,10" stroke="#6366f1" strokeWidth="2" fill="none" />
        <circle cx="2" cy="25" r="2" fill="#6366f1" />
        <circle cx="10" cy="20" r="2" fill="#6366f1" />
        <circle cx="18" cy="15" r="2" fill="#6366f1" />
        <circle cx="26" cy="10" r="2" fill="#6366f1" />
      </g>

      {/* Title */}
      <text x="200" y="25" fontSize="18" fontWeight="bold" fill="#1f2937" textAnchor="middle">
        Gestion de Stock
      </text>

      {/* Decorative elements */}
      <circle cx="50" cy="50" r="3" fill="#fbbf24" opacity="0.6" />
      <circle cx="350" cy="60" r="4" fill="#10b981" opacity="0.6" />
      <circle cx="370" cy="100" r="2" fill="#3b82f6" opacity="0.6" />
      <circle cx="30" cy="120" r="2" fill="#ef4444" opacity="0.6" />
    </svg>
  );
};

export default SalesIllustration;
