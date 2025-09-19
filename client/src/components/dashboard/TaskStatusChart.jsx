"use client";

import React, { useMemo } from "react";
import TaskStatusBarChart from "../task/TaskStatusBarChart";

// Utility to prepare chart data
const getTaskStatusData = (tasks, selectedDate) => {
  const statuses = ["pending", "in-progress", "completed"];

  const filteredTasks = tasks.filter((t) => t.dueDate === selectedDate);

  const counts = statuses.map((status) => ({
    status,
    count: filteredTasks.filter((t) => t.status === status).length,
  }));

  return counts;
};

const Dashboard = ({ tasks, selectedDate = "2025-09-17" }) => {
  const chartData = useMemo(
    () => getTaskStatusData(tasks, selectedDate),
    [tasks, selectedDate]
  );

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-xl font-bold mb-4">Task Status for {selectedDate}</h1>
      <TaskStatusBarChart data={chartData} fromTaskModal={true} />
    </div>
  );
};

export default Dashboard;
