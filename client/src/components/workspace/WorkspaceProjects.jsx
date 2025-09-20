import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Folder, Plus } from "lucide-react";
import NotFound from "../admin/NotFound";
import ProjectAction from "../project/ProjectAction";
import ProjectCard from "../project/ProjectCard";

const WorkspaceProjects = ({ projects = [] }) => {
  console.log(projects);
  const { workspaceId } = useParams();

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between">
        <div>
          <CardTitle>Workspace Projects</CardTitle>
          <CardDescription className={"mt-2"}>
            Manage projects in this workspace
          </CardDescription>
        </div>
        <ProjectAction workspaceId={workspaceId} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          {projects.length === 0 && (
            <NotFound
              title="No projects found!"
              description="Get started by creating a new project."
              action={<ProjectAction workspaceId={workspaceId} />}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceProjects;
