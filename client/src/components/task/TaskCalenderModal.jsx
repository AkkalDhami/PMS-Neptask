import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import TaskKanbanCard from "./TaskKanbanCard";
import toast from "react-hot-toast";
import { useUpdateTaskStatusMutation } from "../../features/task/taskApi";
import { ListTodo } from "lucide-react";
import TaskStatusChartByDate from "./TaskStatusChartByDate";
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

const TaskCalenderModal = ({
  selectedDate,
  isModalOpen,
  setIsModalOpen,
  getTasksForDate,
}) => {
  const [updateTaskStatus, { isLoading: isStatusUpdating }] =
    useUpdateTaskStatusMutation();
  if (!selectedDate) return null;
  const tasks = getTasksForDate(selectedDate);

  const filterTaskByStatus = (status) => {
    return status === "all" ? tasks : tasks.filter((t) => t.status === status);
  };

  const allTasks = filterTaskByStatus("all");
  const completedTasks = filterTaskByStatus("completed");
  const inProgressTasks = filterTaskByStatus("in-progress");
  const pendingTasks = filterTaskByStatus("pending");

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
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-[900px]">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {format(selectedDate, "MMMM dd, yyyy")}
          </DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="all" className="max-w-[900px] w-full">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
              </TabsList>

              {allTasks.length === 0 ? (
                <NoTaskFound />
              ) : (
                <>
                  <TabsContent value="all">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      {allTasks.map((task) => (
                        <TaskKanbanCard
                          key={task._id}
                          fromCardView={true}
                          task={task}
                          isStatusUpdating={isStatusUpdating}
                          handleTaskStatusChange={handleTaskStatusChange}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      {completedTasks.length > 0 ? (
                        completedTasks.map((task) => (
                          <TaskKanbanCard
                            key={task._id}
                            fromCardView={true}
                            task={task}
                            isStatusUpdating={isStatusUpdating}
                            handleTaskStatusChange={handleTaskStatusChange}
                          />
                        ))
                      ) : (
                        <NoTaskFound />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="in-progress">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      {inProgressTasks.length > 0 ? (
                        inProgressTasks.map((task) => (
                          <TaskKanbanCard
                            key={task._id}
                            fromCardView={true}
                            task={task}
                            isStatusUpdating={isStatusUpdating}
                            handleTaskStatusChange={handleTaskStatusChange}
                          />
                        ))
                      ) : (
                        <NoTaskFound />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="pending">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      {pendingTasks.length > 0 ? (
                        pendingTasks.map((task) => (
                          <TaskKanbanCard
                            key={task._id}
                            fromCardView={true}
                            task={task}
                            isStatusUpdating={isStatusUpdating}
                            handleTaskStatusChange={handleTaskStatusChange}
                          />
                        ))
                      ) : (
                        <NoTaskFound />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="chart">
                    <TaskStatusChartByDate
                      tasks={allTasks}
                      selectedDate={selectedDate}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCalenderModal;
