import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Folder,
  CalendarArrowDown,
  Briefcase,
  Lock,
  Unlock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format, formatDistance } from "date-fns";
import TaskAction from "../task/TaskAction";
import DeleteAlertDialog from "../admin/AlertDailog";
import ProjectAction from "./ProjectAction";
import { statusIcons } from "../../utils/statusIcon";

import { Badge } from "@/components/ui/badge";
import {
  getPriorityColor,
  getProjectStatusBadge,
} from "../../utils/badgeColor";
import { priorityIcons } from "../../utils/priorityIcon";
import { useUpdateProjectActiveMutation } from "../../features/project/projectApi";
import toast from "react-hot-toast";

const ProjectHeaderInfo = ({ project }) => {
  const [updateProjectActive, { isLoading }] = useUpdateProjectActiveMutation();
  const handleToggleActive = async () => {
    if (!project?._id) return;
    try {
      const res = await updateProjectActive({
        projectId: project._id,
        isActive: { isActive: !project.isActive },
      }).unwrap();
      toast.success(res?.message)
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-lg flex text-white items-center justify-center`}
            style={{ backgroundColor: project?.workspace?.color }}
          >
            {project?.name?.charAt(0)?.toUpperCase()}
          </div>

          <h1 className="text-3xl capitalize font-bold">{project.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToggleActive} disabled={isLoading}>
            {project?.isActive ? (
              <Lock className="h-8 w-8 text-foreground" />
            ) : (
              <Unlock className="h-8 w-8 text-foreground" />
            )}
          </Button>
          <TaskAction />
          <ProjectAction
            initialData={project}
            workspaceId={project?.workspace?._id}
          />
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-3 sm:gap-6">
        <p className="text-foreground flex items-center">
          <Calendar className="h-4 w-4 mr-2" /> Created on:{" "}
          {format(new Date(project.createdAt), "MMMM dd, yyyy")}
        </p>
        <p className="text-foreground flex items-center">
          <CalendarArrowDown className="h-4 w-4 mr-2" /> Updated{" "}
          {formatDistance(new Date(project.updatedAt), new Date(), {
            includeSeconds: true,
            addSuffix: true,
          })}
        </p>
        <Link
          to={`/workspace/${project?.workspace?._id}`}
          className="text-foreground flex items-center"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          <span>{project?.workspace?.name}</span>
        </Link>

        <Badge
          variant="outline"
          className={`capitalize ${getProjectStatusBadge(project?.status)}`}
        >
          {statusIcons[project?.status]}{" "}
          <span>{project?.status.replace("-", " ")}</span>
        </Badge>
        <Badge
          variant="outline"
          className={`capitalize ${getPriorityColor(project?.priority)}`}
        >
          {priorityIcons[project?.priority]} <span>{project?.priority}</span>
        </Badge>
      </div>
    </>
  );
};

export default ProjectHeaderInfo;
