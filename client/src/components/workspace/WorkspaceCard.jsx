import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  LucideBuilding2,
  LucideFolder,
  LucideUserCog,
  LucideUsers,
} from "lucide-react";
import { dateFormater } from "../../utils/dateFormater";
import { Link, useNavigate } from "react-router-dom";
export default function WorkspaceCard({ workspace }) {
  const {
    name,
    description,
    admin,
    color,
    organization,
    projects,
    members,
    isActive,
    createdAt,
  } = workspace;

  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/workspace/${workspace._id}`)}
      className={`w-full border border-zinc-500/40 cursor-pointer hover:border-orange-600  ${
        !isActive ? "bg-amber-500/10 border-amber-600 " : ""
      } max-w-[380px] shadow-sm hover:shadow-md transition rounded-xl gap-3`}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-medium">
            <div
              className={`w-10 h-10 rounded-lg flex text-white items-center justify-center`}
              style={{ backgroundColor: color }}>
              {name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="line-clamp-1 capitalize font-semibold">
                {name}
              </span>
              <span className="text-sm text-muted-foreground">
                Created on {dateFormater(createdAt)}
              </span>
            </div>
          </CardTitle>
          <CardDescription className="capitalize line-clamp-1 text-sm mt-2.5 text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="flex justify-between items-center flex-wrap gap-2 text-sm text-muted-foreground font-medium">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-2">
              <LucideFolder className="w-4 h-4" />
              {projects?.length} project{projects.length !== 1 && "s"}
            </div>
            <div className="flex items-center gap-2">
              <LucideUsers className="w-4 h-4" />
              {members.length} member
              {members.length !== 1 && "s"}
            </div>
          </div>
        </div>
        <div className="flex text-card-foreground font-medium items-center gap-2">
          <LucideUserCog className="w-4 h-4" />
          <p>Created by: {admin.name}</p>
        </div>
        <div className="flex text-card-foreground font-medium items-center gap-2">
          <LucideBuilding2 className="w-4 h-4" />
          <p>
            Organization:{" "}
            <Link to={`/organization/${organization._id}`}>
              {organization.name}
            </Link>
          </p>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
            {members.map((member) => (
              <Tooltip key={member._id}>
                <TooltipTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={member?.user?.avatar?.url}
                      className="object-cover"
                    />
                    <AvatarFallback
                      className="rounded-lg text-white"
                      style={{ backgroundColor: color }}>
                      {member?.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {member?.user?.name}{" "}
                    <strong className="capitalize">[{member?.role}]</strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        <Badge
          className={`${
            isActive
              ? "bg-green-500/10 text-green-600"
              : "bg-amber-500/10 text-amber-600 "
          }`}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </CardFooter>
    </Card>
  );
}
