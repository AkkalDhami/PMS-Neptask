import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getPriorityColor,
  getProjectStatusBadge,
} from "../../utils/badgeColor";
import {
  AlertOctagon,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Flag,
  Hourglass,
  Loader,
  Plus,
  UserCog,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { RiTimerLine } from "react-icons/ri";
import ProjectTaskChart from "./ProjectTaskChart";
import ProjectDeleteCard from "./ProjectDeleteCard";
import { statusIcons } from "../../utils/statusIcon";
import { priorityIcons } from "../../utils/priorityIcon";
import TaskStatusBarChart from "../task/TaskStatusBarChart";

const ProjectInfo = ({ project, stats }) => {
  const data = [
    { status: "pending", count: stats.pending },
    { status: "in-progress", count: stats.inProgress },
    { status: "completed", count: stats.completed },
  ];
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex-1 space-y-6">
        <TaskStatusBarChart data={data} />

        {/* Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>Created By:</span>
              <span className="font-medium">
                {project?.createdBy.name || project?.createdBy.email}
              </span>
            </div>
            {project.members.map((member) => (
              <div
                key={member.user._id}
                className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.user?.avatar?.url} />
                    <AvatarFallback
                      className={`text-white`}
                      style={{ backgroundColor: project?.workspace?.color }}>
                      {member.user.name
                        ? member.user.name?.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{member.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full md:w-auto flex-col gap-4">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Progress</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="w-full" />

            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span>Priority:</span>

              <Badge
                variant="outline"
                className={`capitalize ${getPriorityColor(project?.priority)}`}>
                {priorityIcons[project?.priority]}{" "}
                <span>{project?.priority}</span>
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Status:</span>
              <Badge
                variant="outline"
                className={`capitalize ${getProjectStatusBadge(
                  project?.status
                )}`}>
                {statusIcons[project?.status]}{" "}
                <span>{project?.status.replace("-", " ")}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Start Date:</span>
              <span className="font-medium">
                {format(project.startDate, "MMMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due Date:</span>
              <span className="font-medium">
                {format(project.dueDate, "MMMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created At:</span>
              <span className="font-medium">
                {format(project.createdAt, "MMMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated At:</span>
              <span className="font-medium">
                {format(project.updatedAt, "MMMM dd, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>Total tasks: </span>
              <span className="font-medium">{stats.totalTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completed tasks: </span>
              <span className="font-medium">{stats.completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4" />
              <span>In Progress tasks: </span>
              <span className="font-medium">{stats.inProgress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hourglass className="h-4 w-4" />
              <span>Pending tasks: </span>
              <span className="font-medium">{stats.pending}</span>
            </div>
            <div className="flex items-center gap-2">
              <RiTimerLine className="h-4 w-4" />
              <span>Overdue tasks: </span>
              <span className="font-medium">{stats.overdueTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4" />
              <span>High Priority tasks: </span>
              <span className="font-medium">{stats.highPriority}</span>
            </div>
          </CardContent>
        </Card>

        <ProjectDeleteCard projectId={project?._id} />
      </div>

      {/* Tags */}
    </div>
  );
};

export default ProjectInfo;
