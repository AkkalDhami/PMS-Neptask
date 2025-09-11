import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ThemeToggle from "./ThemeToggle";
import { Link, Outlet, useLocation } from "react-router-dom";
import AppBreadcrumb from "./AppBreadcrumb";

export default function AppLayout() {
  const location = useLocation();
  let locPath = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider className={"max-w-[1480px] mx-auto w-full"}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex fixed top-0 z-50 bg-background max-w-[1220px] w-full h-16 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumb locPath={locPath} />
          </div>
          <ThemeToggle />
        </header>
        <main className="flex mt-18 flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
