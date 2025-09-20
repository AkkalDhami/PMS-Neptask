import React, { useState, useEffect } from "react";
import Placeholder from "../../components/ui/placeholder";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import WorkspaceAction from "../../components/workspace/WorkspaceAction";
import NotFound from "../../components/admin/NotFound";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllWorkspacesQuery } from "../../features/workspace/workspaceApi";

const Workspace = () => {
  const [page, setPage] = useState(1);
  const limit = 9;
  const [allWorkspaces, setAllWorkspaces] = useState([]);

  const { data, isLoading, isFetching, error } = useGetAllWorkspacesQuery({
    page,
    limit,
  });
  console.log(data);
  const workspaces = data?.workspaces;
  const hasMore = data?.pagination?.hasMore;

  // Append new data when page changes and avoid duplicates
  useEffect(() => {
    if (workspaces?.length > 0) {
      setAllWorkspaces((prev) => {
        if (page === 1) return workspaces;
        const newItems = workspaces?.filter(
          (w) => !prev.some((p) => p._id === w._id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [workspaces, page]);

  useEffect(() => {
    if (page === 1 && workspaces?.length === 0) {
      setAllWorkspaces([]);
    }
  }, [page, workspaces?.length]);

  if (isLoading && page === 1) {
    return <Placeholder length={9} />;
  }

  if (error) {
    return <div>Error: {error.error || error.data?.message}</div>;
  }

  return (
    <>
      {/* Header */}
      
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold bg-gradient text-transparent bg-clip-text sm:text-2xl mb-2">
            Workspaces
          </h2>
          <p>Create and manage your workspaces and teams.</p>
        </div>
        <WorkspaceAction fromWorkspace={true} />
      </div>

      {/* Not Found */}
      {allWorkspaces.length === 0 && !isLoading && (
        <NotFound
          icon={
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          }
          title="No workspaces found!"
          description="Get started by creating a new workspace."
          action={<WorkspaceAction fromWorkspace={true} />}
        />
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap md:items-center gap-4">
        {allWorkspaces.map((workspace) => (
          <WorkspaceCard workspace={workspace} key={workspace._id} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isFetching}
            className="w-full sm:w-auto">
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
};

export default Workspace;
