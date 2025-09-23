import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Folder,
  House,
  Layers,
  LayoutDashboard,
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
import { useUserRole } from "../../hooks/use-user-role";

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

const sideLinks = {
  mainLinks: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Workspaces",
      url: "/workspace",
      icon: <Briefcase className="h-5 w-5" />,
      items: [
        {
          title: "Workspaces",
          url: "/workspace",
          icon: <Briefcase className="h-5 w-5" />,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const role = useUserRole();
  console.log(role);
  const location = useLocation();
  const { data: orgs, error, isLoading } = useGetAllOrgsQuery();
  const navigate = useNavigate();
  if (error) {
    toast.error(error?.message || error?.error);
    return <div>Error: {error.error}</div>;
  }

  const handleOnChange = (e) => {
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
                        }
                      >
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
      {role == "owner" ? (
        <>
          <SidebarContent className={"p-4 gap-0"}>
            <div className="ml-4">
              <AppLogo size="md" />
            </div>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = location.pathname.includes(item.url);

                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild size={"lg"} isActive={isActive}>
                    <Link to={item.url}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>;
              })}
            </SidebarMenu>
          </SidebarContent>
        </>
      ) : (
        <>
          <div className="ml-4 mb-3">
            <AppLogo size="md" />
          </div>
          {sideLinks.mainLinks.map((item) => (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarRail />
                <SidebarGroupLabel
                  asChild
                  className="group/label h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                >
                  <CollapsibleTrigger className="flex gap-2 w-full items-center rounded-md px-3 py-1 font-medium outline-none transition-colors mb-2 data-[state=open]/collapsible:bg-sidebar-accent data-[state=open]/collapsible:text-sidebar-accent-foreground">
                    {item.icon} {item.title}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item?.items?.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            size={`lg`}
                            asChild
                            isActive={item.isActive}
                          >
                            <Link to={item.url}>
                              {item?.icon} {item.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
