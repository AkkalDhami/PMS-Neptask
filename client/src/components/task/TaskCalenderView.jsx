import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskCalenderModal from "./TaskCalenderModal";

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("month");

  // Get the current month and year
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const firstDayOfMonth = () => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    return firstDay.getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date);
    return tasks.filter((task) => formatDate(task.dueDate) === dateStr);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getStatusClassName = (status) => {
    const classOptions = {
      pending: "border-amber-500 bg-amber-500/10 text-amber-600",
      "in-progress": "border-blue-500 bg-blue-500/10 text-blue-600",
      completed: "border-green-500 bg-green-500/10 text-green-600",
    };
    return classOptions[status];
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const daysCount = daysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    const firstDay = firstDayOfMonth();

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 p-2 border rounded-lg bg-zinc-500/10"></div>
      );
    }

    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const dateStr = formatDate(date);
      const dayTasks = getTasksForDate(date);
      const isToday = formatDate(new Date()) === dateStr;

      days.push(
        <div
          key={i}
          className={`h-32 p-2 border rounded-lg cursor-pointer ${
            isToday ? "bg-card border-orange-500" : ""
          }`}
          onClick={() => handleDateClick(date)}>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-medium ${
                isToday ? "text-orange-600" : ""
              }`}>
              {i}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {dayTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className={`mb-1 w-full border-l-3 ${getStatusClassName(
                  task.status
                )} sm:text-sm rounded px-2 py-[4px] truncate`}>
                <span
                  className={`task-indicator ${
                    task.status === "completed"
                      ? "bg-green-500"
                      : task.status === "inProgress"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}></span>
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-sm text-muted-foreground font-medium">
                +{dayTasks.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container mx-auto mt-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant={"outline"}
            className="px-2 py-1 hover:bg-secondary rounded-lg"
            onClick={prevMonth}>
            <ChevronLeft />
          </Button>
          <h1 className="text-2xl flex items-center gap-3 font-bold">
            <Calendar /> {month} {year}
          </h1>
          <Button
            variant={"outline"}
            className="px-2 py-1 hover:bg-secondary rounded-lg"
            onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </div>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <Button variant={"outline"} onClick={() => setView("month")}>
              Month
            </Button>
            <Button variant={"outline"} onClick={() => setView("week")}>
              Week
            </Button>
            <Button variant={"outline"} onClick={() => setView("day")}>
              Day
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={"default"}
              className="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskCalenderModal
          selectedDate={selectedDate}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          getTasksForDate={getTasksForDate}
        />
      )}
    </div>
  );
};

export default CalendarView;
