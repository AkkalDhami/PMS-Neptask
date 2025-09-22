import React, { useMemo } from "react";
import TaskStatusBarChart from "../task/TaskStatusBarChart";
import { format } from "date-fns";

const getTaskStatusData = (tasks, selectedDate) => {
  const statuses = ["pending", "in-progress", "completed"];

  const filteredTasks = tasks?.filter(
    (t) => format(t.dueDate, "yyyy-MM-dd") == selectedDate
  );

  const counts = statuses.map((status) => ({
    status,
    count: filteredTasks.filter((t) => t.status === status).length,
  }));

  return counts;
};

const TaskStatusChartByDate = ({ tasks, selectedDate = "2025-09-17" }) => {
  const chartData = useMemo(
    () => getTaskStatusData(tasks, format(selectedDate, "yyyy-MM-dd")),
    [tasks, selectedDate]
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Task Status for {format(selectedDate, "yyyy-MM-dd")}
      </h1>
      <TaskStatusBarChart data={chartData} />
    </div>
  );
};

export default TaskStatusChartByDate;
