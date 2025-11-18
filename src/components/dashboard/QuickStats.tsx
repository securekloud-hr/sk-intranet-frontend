
import React from "react";

export function QuickStats() {
  const stats = [
    { label: "Policies", value: "124" },
    { label: "Open Jobs", value: "15" },
    { label: "Learning Courses", value: "58" },
    { label: "Holidays", value: "12" },
  ];

  // Set to false to hide
  const showStats = false;

  if (!showStats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg p-4 border shadow-sm flex flex-col items-center justify-center text-center"
        >
          <div className="text-2xl md:text-3xl font-bold text-skcloud-purple">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
