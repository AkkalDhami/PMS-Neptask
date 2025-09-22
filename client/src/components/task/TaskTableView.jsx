import {
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} from "../../features/task/taskApi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { priorityIcons } from "../../utils/priorityIcon";
import { statusIcons } from "../../utils/statusIcon";
import {
  Calendar1,
  Calendar,
  FileText,
  Trash2,
  Edit,
  Eye,
  ListChecks,
  MoreVertical,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPriorityColor,
  getProjectStatusBadge,
} from "../../utils/badgeColor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "../admin/AlertDailog";
import TaskAction from "./TaskAction";
import { isOverdue } from "../../utils/isOverdue";
import AddSubtaskModal from "./AddSubtaskModal";
import { useNavigate } from "react-router-dom";
const TaskTableView = ({ tasks, project, isLoading }) => {
  const [updateTaskStatus, { isLoading: isStatusUpdating }] =
    useUpdateTaskStatusMutation();
  
  const naviagate = useNavigate();

  const [deleteTask] = useDeleteTaskMutation();

  const handleTaskStatusChange = async (task) => {
    try {
      const res = await updateTaskStatus({
        taskId: task?._id,
        status: task?.status === "completed" ? "pending" : "completed",
      }).unwrap();

      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.message || error?.error || error?.data?.message);
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await deleteTask(taskId).unwrap();
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.message || error?.error || error?.data?.message);
      console.error(error);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Task</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tasks found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters or create a new task.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task._id} className="group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 capitalize">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => handleTaskStatusChange(task)}
                        disabled={isStatusUpdating}
                        className="cursor-pointer"
                      />
                      <div
                        className={`font-medium ${
                          task.status === "completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}>
                        {task.title.length > 20
                          ? task.title.slice(0, 20) + "..."
                          : task.title}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {task.assignedTo ? (
                    <div className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar>
                            <AvatarImage
                              src={task.assignedTo?.avatar?.url}
                              className="object-cover"
                            />
                            <AvatarFallback
                              className="rounded-lg cursor-pointer text-white"
                              style={{
                                backgroundColor: project?.workspace.color,
                              }}>
                              {task.assignedTo.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm font-medium">
                            {task.assignedTo.name}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center`}>
                    <Calendar1 className="h-4 w-4 mb-1 mr-1" />
                    {format(task.startDate, "MMM dd, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`flex items-center ${
                      isOverdue(task.dueDate) && task.status !== "completed"
                        ? "text-red-500 font-medium"
                        : ""
                    }`}>
                    <Calendar className="h-4 mb-1 w-4 mr-1" />
                    {format(task.dueDate, "MMM dd, yyyy")}
                    {isOverdue(task.dueDate) && task.status !== "completed" && (
                      <AlertCircle className="h-4 w-4 ml-1 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getPriorityColor(
                      task?.priority
                    )} capitalize`}>
                    {priorityIcons[task.priority]}
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getProjectStatusBadge(
                      task?.status
                    )} capitalize`}>
                    {statusIcons[task.status]} {task.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        naviagate(`/project/${project._id}/task/${task._id}`)
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Task
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <TaskAction initialData={task} fromTask={true} />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Add Note
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <AddSubtaskModal taskId={task._id} />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600">
                        <p>
                          <DeleteAlertDialog
                            triggerText="Delete Task"
                            title={"Are you sure to delete this task?"}
                            description={
                              <>
                                Are you sure to delete this task:{" "}
                                <strong>{task?.title}</strong> ?
                              </>
                            }
                            onConfirm={() => handleDeleteTask(task?._id)}
                          />
                        </p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTableView;
