import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Folder,
  House,
  Layers,
  LucideLayoutDashboard,
  User2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useGetAllOrgsQuery } from "../../features/org/orgApi";
import AppLogo from "../home/AppLogo";
// This is sample data.
const data = {
  navMain: [
    {
      label: "Organization",
      url: "/organization",
      icon: <Building2 />,
    },
    {
      label: "Dashboard",
      url: "/dashboard",
      icon: <LucideLayoutDashboard />,
    },
    {
      label: "Workspace",
      url: "/workspace",
      icon: <Layers />,
    },
    {
      label: "Projects",
      url: "/project",
      icon: <Folder />,
    },
    {
      label: "My Profile",
      url: "/my-profile",
      icon: <User2 />,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const { data: orgs, error, isLoading } = useGetAllOrgsQuery();
  const navigate = useNavigate();
  console.log(location);
  if (error) {
    toast.error(error?.message || error?.error);
    return <div>Error: {error.error}</div>;
  }

  const handleOnChange = (e) => {
    console.log(e);
    navigate(`/organization/${e}`);
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader className={"p-4"}>
        <Select onValueChange={handleOnChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Organization" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {orgs?.orgs?.map((org) => (
                  <SelectItem key={org?._id} value={org._id}>
                    <Avatar className="h-8 w-8 font-medium rounded-lg">
                      <AvatarImage
                        src={org.logo?.url}
                        className={"object-cover"}
                      />
                      <AvatarFallback
                        className={
                          "rounded-lg bg-primary dark:text-black text-white"
                        }>
                        {org?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {org.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent className={"p-4"}>
        <div className="ml-4">
          <AppLogo size="md" />
        </div>
        <SidebarMenu>
          {data.navMain.map((item) => {
            const isActive = location.pathname.includes(item.url);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild size={"lg"} isActive={isActive}>
                  <Link to={item.url}>
                    {item.icon}
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
