import {
  useCreateOrgMutation,
  useGetAllOrgsQuery,
} from "../../features/org/orgApi";
import Placeholder from "../../components/ui/placeholder";
import OrganizationCard from "../../components/org/OrgCard";
import { Button } from "@/components/ui/button";
import AddOrgModal from "../../components/org/AddOrgModal";
import { toast } from "react-hot-toast";
import { useState } from "react";

const Organization = () => {
  const { data, error, isLoading } = useGetAllOrgsQuery();
  const [createOrg, { error: orgCreateError }] = useCreateOrgMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return <Placeholder length={9} />;
  }
  console.log(data);

  if (error) {
    return <div>Error: {error.error}</div>;
  }
  if (orgCreateError) {
    return <div>Error: {error.error}</div>;
  }
  const handleCreateOrganization = async (data) => {
    try {
      const res = await createOrg(data).unwrap();
      toast.success(res?.message);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error?.message ||
          error?.data?.message ||
          "Failed to create organization"
      );
      console.error(error);
    }
  };
  return (
    <>
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold bg-gradient text-transparent bg-clip-text sm:text-2xl mb-2">
            Organizations
          </h2>
          <p>Create and manage your organizations, workspaces and members.</p>
        </div>
        <AddOrgModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onsubmit={handleCreateOrganization}
        />
      </div>
      {data?.orgs?.length === 0 && !isLoading && (
        <NotFound
          icon={
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          }
          title="No workspaces found!"
          description="Get started by creating a new workspace."
          action={<WorkspaceAction fromWorkspace={true} />}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap md:items-center gap-4">
        {data?.orgs?.map((org) => (
          <OrganizationCard organization={org} key={org._id} />
        ))}
      </div>
    </>
  );
};

export default Organization;
