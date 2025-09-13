import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Trash2,
  Plus,
  Users,
  Folder,
  Download,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Building2,
  LucideUserCog2,
  SeparatorVertical,
} from "lucide-react";

import WorkspaceAction from "../../components/workspace/WorkspaceAction";
import { useParams } from "react-router-dom";
import { useGetWorkspaceQuery } from "../../features/workspace/workspaceApi";
import toast from "react-hot-toast";
import { dateFormater } from "../../utils/dateFormater";
import WorkspaceOverview from "../../components/workspace/WorkspaceOverview";
import WorkspaceMembers from "../../components/workspace/WorkspaceMembers";
import WorkspaceProjects from "../../components/workspace/WorkspaceProjects";
import WorkspaceSetting from "../../components/workspace/WorkspaceSetting";

const WorkspaceDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const params = useParams();
  const { workspaceId } = params;
  const {
    data,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useGetWorkspaceQuery(workspaceId);
  console.log(data);

  if (isLoadingWorkspace) {
    return (
      <div className="container mx-auto p-6 min-h-screen w-full flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin mb-4" />
          <p>Loading workspace data...</p>
        </div>
      </div>
    );
  }

  if (!data?.workspace) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Not Found</CardTitle>
            <CardDescription>
              The requested workspace could not be loaded.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (workspaceError) {
    console.log(workspaceError);
    toast.error(workspaceError?.error || workspaceError?.data?.message);
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              An error occurred while loading the workspace data.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: data?.workspace.color }}>
            {data?.workspace.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{data?.workspace.name}</h1>
            <p className="text-muted-foreground">
              {data?.workspace?.description}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <WorkspaceAction
            workspaceId={data?.workspace._id}
            fromWorkspace={false}
            initialData={data?.workspace}
            orgId={data?.workspace.organization._id}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4 items-center mb-6">
        <Badge
          className={`${
            data?.workspace.isActive ? "bg-green-600" : "bg-red-600"
          } text-white`}>
          {data?.workspace.isActive ? "Active" : "Inactive"}
        </Badge>

        <div className="flex items-center text-sm text-muted-foreground">
          <Building2 className="mr-1 h-4 w-4" />
          <span>{data?.workspace.organization.name}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>Created on {dateFormater(data?.workspace.createdAt)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <LucideUserCog2 className="mr-1 h-4 w-4" />
          <span>Created by {data?.workspace.admin?.name}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Folder className="mr-1 h-4 w-4" />
          <span>
            {data?.workspace.projects?.length} project
            {data?.workspace.projects?.length > 1 && "s"}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          <span>
            {data?.workspace.members?.length} member
            {data?.workspace.members?.length > 1 && "s"}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <WorkspaceOverview workspace={data?.workspace} />
        </TabsContent>

        <TabsContent value="members">
          <WorkspaceMembers members={data?.workspace?.members} />
        </TabsContent>

        <TabsContent value="projects">
          <WorkspaceProjects projects={data?.workspace?.projects} />
        </TabsContent>

        <TabsContent value="settings">
          <WorkspaceSetting workspace={data?.workspace} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceDetailsPage;
