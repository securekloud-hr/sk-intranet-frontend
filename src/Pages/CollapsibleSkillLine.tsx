// CollapsibleSkillLine.tsx
import React, { useState } from "react";

interface CollapsibleSkillLineProps {
  label: string;      // e.g. "Primary Skills"
  value?: string;     // e.g. "HTML,CSS,Word Press,Java Script"
  limit?: number;     // how many items to show before "...", default 3
}

const CollapsibleSkillLine: React.FC<CollapsibleSkillLineProps> = ({
  label,
  value = "",
  limit = 3,
}) => {
  const [expanded, setExpanded] = useState(false);

  // no value, nothing to show
  if (!value.trim()) return null;

  // split: "HTML,CSS,Word Press" -> ["HTML","CSS","Word Press"]
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const hasMore = items.length > limit;

  const visibleText = expanded
    ? items.join(", ")
    : hasMore
    ? items.slice(0, limit).join(", ")
    : items.join(", ");

  return (
    <p className="text-sm leading-relaxed">
      <span className="font-semibold">{label}: </span>
      <span className="font-normal">
        {visibleText}
        {hasMore && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="ml-1 text-blue-600 underline hover:text-blue-800"
          >
            ...more
          </button>
        )}
        {hasMore && expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="ml-1 text-blue-600 underline hover:text-blue-800"
          >
            show less
          </button>
        )}
      </span>
    </p>
  );
};

export default CollapsibleSkillLine;

