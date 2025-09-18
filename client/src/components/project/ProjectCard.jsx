import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Calendar,
  Users,
  ListTodo,
  ArrowRight,
  LucideUserCog,
  Briefcase,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import {
  getPriorityColor,
  getProjectStatusBadge,
} from "../../utils/badgeColor";
import { Link, useNavigate } from "react-router-dom";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { priorityIcons } from "../../utils/priorityIcon";
import { statusIcons } from "../../utils/statusIcon";
const ProjectCard = ({ project }) => {


  const navigate = useNavigate();
  return (
    <Card
      className={`w-full border gap-4 border-zinc-500/40  hover:border-orange-600 max-w-md hover:shadow-md transition-shadow duration-300 ${
        project?.isActive
          ? ""
          : " bg-amber-500/10 border-amber-500 hover:border-amber-600"
      }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: project?.workspace?.color }}
              className="flex items-center justify-center w-10 h-10 text-white rounded-lg">
              {project?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <CardTitle
                onClick={() => navigate(`/project/${project._id}`)}
                className="text-lg line-clamp-1 capitalize cursor-pointer hover:text-orange-600">
                <h2 className="font-medium sm:font-semibold">{project.name}</h2>
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-1">
                {project.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
          {project?.isActive ? (
            ""
          ) : (
            <div className="bg-amber-500/40 flex items-center justify-center w-8 h-8 rounded-md">
              <Lock className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex capitalize justify-between items-center mb-3">
          <Badge className={`border ${getProjectStatusBadge(project.status)}`}>
            {statusIcons[project.status]}
            {project.status.replace("-", " ")}
          </Badge>
          <Badge
            variant="outline"
            className={`capitalize border ${getPriorityColor(project.priority)}`}>
            {priorityIcons[project.priority]} {project.priority}
          </Badge>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center flex-wrap justify-between gap-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>
                {format(new Date(project.startDate), "MMM dd, yyyy")} -{" "}
                {format(new Date(project.dueDate), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <LucideUserCog className="h-4 w-4 mr-1" />
              <strong className="font-medium">
                Created by {project?.createdBy?.name}
              </strong>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1 mb-1" />
              <span>
                {project.members?.length || 0} member
                {project.members?.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ListTodo className="h-4 w-4 mr-1" />
              <span>
                {project.tasks?.length || 0} task
                {project.tasks?.length > 1 ? "s" : ""}
              </span>
            </div>
            <Link
              to={`/workspace/${project.workspace?._id}`}
              className="flex line-clamp-1 items-center text-sm text-muted-foreground hover:text-foreground">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{project.workspace?.name}</span>
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
          {project?.members.map((member) => (
            <Tooltip key={member._id}>
              <TooltipTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={member?.user?.avatar?.url}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className="rounded-lg cursor-pointer text-white"
                    style={{ backgroundColor: project?.workspace?.color }}>
                    {member?.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{member?.user?.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Link
          to={`/project/${project._id}`}
          className="text-muted-foreground flex items-center text-sm hover:text-foreground">
          View Details <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
