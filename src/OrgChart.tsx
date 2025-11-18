
import React from "react";
import { OrgNode } from "./orgData"; // adjust path if needed

interface Props {
  node: OrgNode;
}

const OrgChartNode: React.FC<Props> = ({ node }) => {
  return (
    <div className="flex flex-col items-center p-2">
      {/* Box for each person */}
      <div className="bg-white border-2 border-sky-400 rounded-lg px-4 py-2 text-center shadow-md min-w-[200px]">
        <strong>{node.title}</strong>
        <div className="text-sm text-gray-600">{node.name}</div>
      </div>

      {/* Children */}
      {node.children && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {node.children.map((child, index) => (
            <OrgChartNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgChartNode;
