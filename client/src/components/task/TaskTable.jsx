import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  ChevronDown,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ListTodo,
  Grid,
  Table as TableIcon,
  Kanban,
  MoreVertical,
  RefreshCcw,
} from "lucide-react";
import { useGetTasksByProjectIdQuery } from "../../features/task/taskApi";
import TaskAction from "./TaskAction";

import TaskFilters from "./TaskFilter";
import TaskTableView from "./TaskTableView";
import { statusIcons } from "../../utils/statusIcon";
import { MdBolt } from "react-icons/md";
import CalendarView from "./TaskCalenderView";
import TaskCardView from "./TaskCardView";
import TaskKanbanView from "./TaskKanbanView";

const TaskTable = ({ project }) => {
  const { projectId } = useParams();
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({
    status: "",
    filter: "",
    sort: "newest",
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError, refetch } = useGetTasksByProjectIdQuery({
    projectId,
    ...filters,
  });
  console.log(data);

  const tasks = data?.data?.tasks || [];
  const pagination = data?.data?.pagination || {};
  const counts = data?.data?.counts || {};

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      filter: "",
      sort: "newest",
      search: "",
      page: 1,
      limit: 10,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: "outline",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: Clock,
      },
      completed: {
        variant: "default",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: CheckCircle2,
      },
      "in-progress": {
        variant: "default",
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: Clock,
      },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`${config.color} ${config.bg} border-0 gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status === "in-progress"
          ? "In Progress"
          : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: "outline", color: "text-gray-600" },
      medium: { variant: "default", color: "text-blue-600", bg: "bg-blue-100" },
      high: {
        variant: "default",
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
      critical: { variant: "default", color: "text-red-600", bg: "bg-red-100" },
    };

    const config = priorityConfig[priority] || { variant: "secondary" };

    return (
      <Badge
        variant={config.variant}
        className={`${config.color} ${config.bg || ""} border-0`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Failed to load tasks</h3>
          <p className="text-muted-foreground mt-2">
            There was an error loading the tasks. Please try again.
          </p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Your Tasks</h1>
        <div className="flex gap-2">
          <TaskAction />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={"text-blue-600"}
                onClick={() => handleFilterChange("status", "")}>
                <MdBolt className="h-4 w-4 mr-2 text-blue-600" /> All Status
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"text-amber-600"}
                onClick={() => handleFilterChange("status", "pending")}>
                {statusIcons.pending} Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"text-indigo-600"}
                onClick={() => handleFilterChange("status", "in-progress")}>
                {statusIcons["in-progress"]} In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"text-green-600"}
                onClick={() => handleFilterChange("status", "completed")}>
                {statusIcons.completed} Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={resetFilters}>
                <RefreshCcw className="h-4 w-4 mr-2 text-red-600" /> Reset
                Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Filter Cards */}
      <TaskFilters
        counts={counts}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
      />

      <Tabs value={view} onValueChange={setView} className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Table
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="card" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Card
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 w-full sm:w-[200px]"
              value={filters.search}
              onChange={handleSearch}
            />
          </div>

          <Select
            value={filters.sort}
            onValueChange={(value) => handleFilterChange("sort", value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="dueDateAsc">Due Date (Asc)</SelectItem>
              <SelectItem value="dueDateDesc">Due Date (Desc)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* </div> */}

        <TabsContent value="table" className="mt-0">
          <TaskTableView
            tasks={tasks}
            isLoading={isLoading}
            project={project}
          />
        </TabsContent>

        <TabsContent value="kanban" className="mt-0">
          <TaskKanbanView tasks={tasks} />
        </TabsContent>

        <TabsContent value="card" className="mt-0">
          <TaskCardView tasks={tasks} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView tasks={tasks} />
        </TabsContent>
      </Tabs>

      {pagination.pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handleFilterChange("page", Math.max(1, filters.page - 1))
                }
                className={
                  filters.page === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (filters.page <= 3) {
                pageNum = i + 1;
              } else if (filters.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = filters.page - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={filters.page === pageNum}
                    onClick={() => handleFilterChange("page", pageNum)}>
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handleFilterChange(
                    "page",
                    Math.min(pagination.pages, filters.page + 1)
                  )
                }
                className={
                  filters.page === pagination.pages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TaskTable;
