import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { useGetAllProjectsQuery } from "../../features/project/projectApi";
import ProjectAction from "../../components/project/ProjectAction";
import { Briefcase, RefreshCw } from "lucide-react";
import ProjectCard from "../../components/project/ProjectCard";
import NotFound from "../../components/admin/NotFound";

// ✅ custom debounce hook
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Project() {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching } = useGetAllProjectsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const projects = data?.data?.projects || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: 6,
    total: 0,
    pages: 0,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen w-full flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin mb-4" />
          <p className="text-2xl bg-gradient text-transparent bg-clip-text font-medium">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold bg-gradient text-transparent bg-clip-text sm:text-2xl mb-2">
            Projects
          </h2>
          <p>Create and manage your projects and teams.</p>
        </div>
        <ProjectAction />
      </div>

      {/* Not Found */}
      {projects.length === 0 && !isLoading && (
        <NotFound
          icon={
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          }
          title="No projects found!"
          description="Get started by creating a new project."
          action={<ProjectAction />}
        />
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to page 1 when typing
            }}
            className="w-64"
          />
          {isFetching && (
            <span className="text-sm text-gray-500">Searching...</span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          {/* Project Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard project={project} key={project._id} />
              ))
            ) : (
              <p className="text-gray-500">No projects found.</p>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={pagination.page === 1}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.pages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={pagination.page === i + 1}
                      onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, pagination.pages))
                    }
                    disabled={pagination.page === pagination.pages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </>
  );
}
