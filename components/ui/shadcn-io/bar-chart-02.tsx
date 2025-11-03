'use client';

import React from 'react';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartBarDefaultProps {
  data?: ChartData[];
  title?: string;
  className?: string;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
}

const defaultData: ChartData[] = [
  { name: 'Jan', value: 400, color: '#3b82f6' },
  { name: 'Feb', value: 300, color: '#10b981' },
  { name: 'Mar', value: 500, color: '#f59e0b' },
  { name: 'Apr', value: 280, color: '#ef4444' },
  { name: 'May', value: 590, color: '#8b5cf6' },
  { name: 'Jun', value: 320, color: '#06b6d4' },
];

export const ChartBarDefault: React.FC<ChartBarDefaultProps> = ({
  data = defaultData,
  title = 'Bar Chart',
  className = '',
  height = 300,
  showGrid = true,
  showLabels = true,
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = height - 60; // Reserve space for labels

  return (
    <div className={`w-full p-4 bg-white rounded-lg shadow-sm border ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <div className="relative" style={{ height: `${height}px` }}>
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 w-full" />
            ))}
          </div>
        )}

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-right">
              {Math.round((maxValue * (5 - i)) / 5)}
            </span>
          ))}
        </div>

        {/* Chart bars */}
        <div className="flex items-end justify-center h-full ml-8 mr-2">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            return (
              <div key={index} className="flex flex-col items-center mx-1 flex-1">
                {/* Bar */}
                <div
                  className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer relative group"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: item.color || '#3b82f6',
                    minHeight: '2px',
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.name}: {item.value}
                  </div>
                </div>

                {/* X-axis label */}
                {showLabels && (
                  <span className="text-xs text-gray-600 mt-2 text-center">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartBarDefault;
