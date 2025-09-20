import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeColor } from "../../utils/badgeColor";
import { dateFormater } from "../../utils/dateFormater";
import { AddMemberDialog } from "../admin/Form";

const WorkspaceMembers = ({ members }) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Members</CardTitle>
        <CardDescription>
          Manage members and their permissions in this workspace
        </CardDescription>
        <CardAction>
          <AddMemberDialog users={members} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-lg divide-y">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
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
                  <div>
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <>
                    <Badge className={`${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined {dateFormater(member.joinedAt)}
                    </span>
                  </>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceMembers;
