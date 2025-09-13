import React from "react";
import { dateFormater } from "../../utils/dateFormater";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Folder, Mail, Shield, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WorkspaceStat from "./WorkspaceStat";
import ContactAdminDialog from "../admin/ContactAdminDailog";

const WorkspaceOverview = ({ workspace = {} }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Details</CardTitle>
            <CardDescription>
              Basic information about your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">agfgs</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/aavash.jpg" alt="Aavash Dhami" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Aavash Dhami created this workspace
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateFormater(workspace.createdAt)}
                  </p>
                </div>
              </div>
              {workspace.members.slice(1, 3).map((member) => (
                <div key={member._id} className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={member.user.avatar}
                      alt={member.user.name}
                    />
                    <AvatarFallback>
                      {member.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {member.user.name} was added as a {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dateFormater(member.joinedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WorkspaceStat
              title={"Total Members"}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              stat={`${workspace.members.length} members`}
            />
            <Separator />

            <WorkspaceStat
              title={"Active Projects"}
              icon={<Folder className="h-4 w-4 text-muted-foreground" />}
              stat={`${workspace.projects.length} projects`}
            />
            <Separator />

            <WorkspaceStat
              title={"Organization"}
              icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
              stat={`${workspace.organization.name}`}
            />
            <Separator />

            <WorkspaceStat
              title={"Workspace status"}
              icon={<Shield className="h-4 w-4 text-muted-foreground" />}
              stat={
                <Badge
                  className={`${
                    workspace.isActive ? "bg-green-600" : "bg-red-600"
                  } text-white`}>
                  {workspace.isActive ? "Active" : "Inactive"}
                </Badge>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={workspace.admin.avatar}
                  alt={workspace.admin.name}
                />
                <AvatarFallback>
                  {workspace.admin.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{workspace.admin.name}</p>
                <p className="text-xs text-muted-foreground">
                  {workspace.admin.email}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
          
            <ContactAdminDialog
              workspace={workspace}
              variant="outline"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WorkspaceOverview;
