import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TaskCard = ({ task }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
        <div className="flex items-center space-x-3">
          <Checkbox checked={task.completed} />
          <div>
            <CardTitle className="text-base">{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </div>
        </div>
        <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee?.avatar} />
            <AvatarFallback>
              {task.assignee?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {task.assignee?.name || "Unassigned"}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
