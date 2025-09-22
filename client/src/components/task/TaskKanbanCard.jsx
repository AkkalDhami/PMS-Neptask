import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getBoderClassName,
  getPriorityColor,
  getProjectStatusBadge,
} from "../../utils/badgeColor";
import { priorityIcons } from "../../utils/priorityIcon";
import { format } from "date-fns";
import { AlertCircle, Calendar } from "lucide-react";
import { statusIcons } from "../../utils/statusIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { isOverdue } from "../../utils/isOverdue";
import AddSubtaskModal from "./AddSubtaskModal";
const TaskKanbanCard = ({
  task,
  fromCardView = false,
  isStatusUpdating,
  handleTaskStatusChange,
}) => {
  return (
    <Card
      className={`${
        !fromCardView && " cursor-move"
      } gap-3 border-l-4 shadow-[0px_1px_4px_0px_#a0aec0] border-y-0 border-r-0 ${getBoderClassName(
        task.status
      )}`}>
      <CardHeader>
        <CardTitle className={"flex items-center gap-3"}>
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={() => handleTaskStatusChange(task)}
            disabled={isStatusUpdating}
            className="cursor-pointer"
          />
          <h4
            className={`font-medium capitalize ${
              task.status === "completed"
                ? "line-through text-muted-foreground"
                : ""
            } line-clamp-1`}>
            {task.title}
          </h4>
        </CardTitle>
        <CardDescription>
          {task.description && (
            <p className="text-sm text-muted-foreground  line-clamp-2">
              {task.description}
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex justify-between items-start mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Task</DropdownMenuItem>
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
              <DropdownMenuItem
                className="text-green-600"
                onSelect={(e) => e.preventDefault()}>
                <AddSubtaskModal />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 mb-0.5" />
            <div className="text-sm flex items-center gap-2 text-muted-foreground">
              <span>{format(task.startDate, "MMM dd, yyyy")}</span>
              <span>{" - "}</span>
              <div
                className={`flex items-center gap-2 ${
                  isOverdue(task.dueDate) && task.status !== "completed"
                    ? "text-red-500 font-medium"
                    : ""
                }`}>
                {format(task.dueDate, "MMM dd, yyyy")}{" "}
                {isOverdue(task.dueDate) && task.status !== "completed" && (
                  <AlertCircle className="h-4 w-4 ml-1 text-red-500" />
                )}
              </div>
            </div>
          </div>
          <Badge className={`${getPriorityColor(task?.priority)} capitalize`}>
            {priorityIcons[task.priority]}
            {task.priority}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className={"flex justify-between"}>
        {task.assignedTo ? (
          <div className="flex items-center gap-2 font-medium">
            <Avatar className="h-7 w-7">
              <AvatarImage src={task.assignedTo.avatar?.url} />
              <AvatarFallback className="text-xs bg-primary font-medium text-primary-foreground">
                {task.assignedTo.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span> {task?.assignedTo?.name}</span>
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        )}
        {fromCardView && (
          <Badge
            className={`${getProjectStatusBadge(task?.status)} capitalize`}>
            {statusIcons[task.status]}
            {task.status}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskKanbanCard;
