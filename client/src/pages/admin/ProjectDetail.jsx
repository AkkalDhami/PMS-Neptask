import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ListTodo, Folder, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProjectQuery } from "../../features/project/projectApi";

import NotFound from "../../components/admin/NotFound";
import ProjectStats from "../../components/project/ProjectStats";
import ProjectInfo from "../../components/project/ProjectInfo";
import ProjectHeaderInfo from "../../components/project/ProjectHeaderInfo";
import TaskCard from "../../components/task/TaskCard";
import TaskTable from "../../components/task/TaskTable";
import AlertCard from "../../components/admin/AlertCard";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: loading } = useGetProjectQuery(projectId);
  console.log(data);
  const project = data?.project;
  const stats = data?.stats;
  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen w-full flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin mb-4" />
          <p className="text-2xl bg-gradient text-transparent bg-clip-text font-medium">
            Loading project data...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center min-h-screen w-full">
        <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="text-2xl font-bold"> Project not found</p>
        <Button variant="default" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container  space-y-6">
      {/* Header */}
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-5 w-5" /> Go Back
      </Button>
      {!project?.isActive && (
        <AlertCard
          title={`Project is locked`}
          description={`This project has been locked by the admin. No changes can be made until it is unlocked.`}
        />
      )}
      <ProjectHeaderInfo project={project} />

      <ProjectStats stats={stats} progress={project.progress} />

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={"col-span-4 sm:col-end-2 md:col-span-2"}>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {project.description || "No description provided."}
            </p>
          </CardContent>
        </Card>
        <Card className={"col-span-4 sm:col-end-2 md:col-span-1"}>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tags && project.tags.length > 0 ? (
                project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No tags added.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Tasks */}
      <TaskTable project={project} />

      <ProjectInfo project={project} stats={stats} />
    </div>
  );
};

export default ProjectDetailsPage;
