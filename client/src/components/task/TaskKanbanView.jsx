import React, { useState, useEffect } from "react";
import TaskAction from "./TaskAction";
import TaskKanbanCard from "./TaskKanbanCard";
import toast from "react-hot-toast";
import { useUpdateTaskStatusMutation } from "../../features/task/taskApi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskKanbanView = ({ tasks }) => {
  const [updateTaskStatus, { isLoading: isStatusUpdating }] =
    useUpdateTaskStatusMutation();
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleTaskStatusChange = async (task) => {
    try {
      const res = await updateTaskStatus({
        taskId: task._id,
        status: task.status === "completed" ? "pending" : "completed",
      }).unwrap();

      toast.success(res.message);

      setLocalTasks((prev) =>
        prev.map((t) =>
          t._id === task._id
            ? {
                ...t,
                status: task.status === "completed" ? "pending" : "completed",
              }
            : t
        )
      );
    } catch (error) {
      toast.error(error?.message || "Failed to update task status");
      console.error(error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // copy of local tasks
    const updatedTasks = [...localTasks];
    const sourceTasks = updatedTasks.filter(
      (t) => t.status === source.droppableId
    );
    const movedTask = { ...sourceTasks[source.index] };

    // check if task is allowed to be updated
    if (!movedTask.isAssignedToMe) {
      toast.error("You cannot update this task.");
      return;
    }

    // update task status based on destination column
    movedTask.status = destination.droppableId;

    try {
      const res = await updateTaskStatus({
        taskId: movedTask._id,
        status: movedTask.status,
      }).unwrap();

      toast.success(res.message);

      // remove old task and insert updated task at new position
      setLocalTasks((prev) => {
        const newTasks = prev.filter((t) => t._id !== movedTask._id);
        newTasks.splice(destination.index, 0, movedTask);
        return newTasks;
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update task status");
      console.error(error);
    }
  };

  const columns = [
    { status: "pending", title: "Pending", color: "yellow" },
    { status: "in-progress", title: "In Progress", color: "blue" },
    { status: "completed", title: "Completed", color: "green" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = localTasks.filter(
            (task) => task.status === column.status
          );

          return (
            <Droppable droppableId={column.status} key={column.status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-4">
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg bg-${column.color}-500/10 border border-${column.color}-700`}>
                    <h3 className={`font-medium text-${column.color}-600`}>
                      {column.title}{" "}
                      <span className="text-sm font-normal">
                        ({columnTasks.length})
                      </span>
                    </h3>
                    <TaskAction fromTask={true} taskStatus={column.status} />
                  </div>

                  <div className="space-y-3">
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                        isDragDisabled={!task.isAssignedToMe}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <TaskKanbanCard
                              task={task}
                              isStatusUpdating={isStatusUpdating}
                              handleTaskStatusChange={handleTaskStatusChange}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {columnTasks.length === 0 && (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground text-sm">
                          No tasks
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskKanbanView;
