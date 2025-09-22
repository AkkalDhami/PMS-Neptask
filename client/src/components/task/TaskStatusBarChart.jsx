"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const STATUS_COLORS = {
  pending: "#f59e0b", // amber
  "in-progress": "#3b82f6", // blue
  completed: "#22c55e", // green
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { value, fill } = payload[0];
    return (
      <div
        className="p-2 rounded-lg shadow-md border"
        style={{
          backgroundColor: "var(--tooltip-bg, white)",
          color: "var(--tooltip-text, black)",
          borderColor: fill,
        }}>
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          Tasks: <span className="font-semibold">{value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const TaskStatusBarChart = ({
  data,
  xKey = "status",
  yKey = "count",
  fromTaskModal = false,
}) => {
  return (
    <div className="w-full h-[450px] p-4">
      {!fromTaskModal && (
        <h2 className="text-lg font-semibold mb-4 ">Task Status Overview</h2>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-300 dark:stroke-gray-700"
          />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "var(--x-axis-text, #374151)" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--y-axis-text, #374151)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey={yKey} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry[xKey]] || "#6b7280"} // default gray
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskStatusBarChart;
