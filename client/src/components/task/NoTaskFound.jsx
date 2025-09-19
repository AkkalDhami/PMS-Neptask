import { ListTodo } from "lucide-react";
import React from "react";

const NoTaskFound = () => {
  return (
    <div className="col-span-full text-center py-12">
      <ListTodo className="w-16 h-16 mx-auto" />
      <h3 className="mt-4 text-lg font-medium">No task found</h3>
      <p className="text-muted-foreground my-2">
        Get started by creating a new task.
      </p>
    </div>
  );
};

export default NoTaskFound;
