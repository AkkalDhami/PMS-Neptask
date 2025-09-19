import React from "react";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../features/task/taskApi";
import TaskDialog from "./TaskFormDailog";
import toast from "react-hot-toast";

const TaskAction = ({ taskStatus, fromTask, initialData }) => {
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const handleTaskSubmit = async (data) => {
    try {
      if (initialData) {
        const res = await updateTask({
          taskId: initialData._id,
          data,
        }).unwrap();
        toast.success(res?.message);
      } else {
        const res = await createTask({ data }).unwrap();
        console.log(res);
        toast.success(res?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.error || error?.data?.message);
    }
  };
  return (
    <TaskDialog
      initialData={initialData}
      onSubmit={handleTaskSubmit}
      fromTask={fromTask}
      status={taskStatus}
    />
  );
};

export default TaskAction;
