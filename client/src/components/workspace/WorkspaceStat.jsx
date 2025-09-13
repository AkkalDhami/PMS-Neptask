import React from "react";

const WorkspaceStat = ({ icon, title, stat }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <span className="font-medium">{stat}</span>
    </div>
  );
};

export default WorkspaceStat;
