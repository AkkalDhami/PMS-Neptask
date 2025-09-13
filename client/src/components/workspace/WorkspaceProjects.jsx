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
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import NotFound from "../admin/NotFound";
import ProjectAction from "../project/ProjectAction";
import ProjectCard from "../project/ProjectCard";

const WorkspaceProjects = ({ projects = [] }) => {
  const { workspaceId } = useParams();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Workspace Projects</CardTitle>
          <CardDescription className={"mt-2"}>
            Manage projects in this workspace
          </CardDescription>
        </div>
        <ProjectAction workspaceId={workspaceId} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))}

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
