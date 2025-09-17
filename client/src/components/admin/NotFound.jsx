import { Folder } from "lucide-react";
import React from "react";

const NotFound = ({
  icon = <Folder className="mx-auto h-12 w-12 text-muted-foreground" />,
  title = "",
  description = "",
  action = "",
}) => {
  return (
    <div className="col-span-full text-center py-12">
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground my-2">{description}</p>
      {action}
    </div>
  );
};

export default NotFound;
