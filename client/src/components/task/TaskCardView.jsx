import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import TaskKanbanCard from "./TaskKanbanCard";
import { ListTodo } from "lucide-react";
import { useUpdateTaskStatusMutation } from "../../features/task/taskApi";
import toast from "react-hot-toast";

const TaskCardView = ({ isLoading, tasks }) => {
  const [updateTaskStatus, { isLoading: isStatusUpdating }] =
    useUpdateTaskStatusMutation();
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : tasks.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <ListTodo className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No tasks found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or create a new task.
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskKanbanCard
            fromCardView={true}
            isStatusUpdating={isStatusUpdating}
            handleTaskStatusChange={handleTaskStatusChange}
            task={task}
            key={task?._id}
          />
        ))
      )}
    </div>
  );
};

export default TaskCardView;
