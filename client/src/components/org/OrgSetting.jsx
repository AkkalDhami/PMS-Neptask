import React from "react";
import toast from "react-hot-toast";
import {
  useDeleteOrgMutation,
  useRecoverOrgMutation,
  useUpdateOrgMutation,
} from "../../features/org/orgApi";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import OrganizationDeletionDialog from "./DeleteOrgDailog";
import { Separator } from "@/components/ui/separator";
import AddOrgModal from "./AddOrgModal";

const OrgSetting = ({ organization, setIsDialogOpen, isDialogOpen }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { orgId } = params;
  const [deleteOrg] = useDeleteOrgMutation();

  const [recoverOrg] = useRecoverOrgMutation();

  const [updateOrg] = useUpdateOrgMutation();

  const onDeletionUpdate = async () => {
    try {
      const res = await deleteOrg({ orgId }).unwrap();
      toast.success(res?.message);
      navigate("/organization");
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
    }
  };

  const onRecoveryUpdate = async () => {
    try {
      const res = await recoverOrg({ orgId }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
    }
  };

  const handleOrganizationUpdate = async (updatedData) => {
    setIsDialogOpen(true);
    try {
      const res = await updateOrg({ orgId, data: updatedData }).unwrap();

      toast.success(res?.message);
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>
          Manage your organization's settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Organization Name</label>
              <p className="text-muted-foreground">{organization.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Organization Email</label>
              <p className="text-muted-foreground">{organization.orgEmail}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Created On</label>
              <p className="text-muted-foreground">
                {format(organization.createdAt, "PPP p")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Last Updated</label>
              <p className="text-muted-foreground">
                {format(organization.updatedAt, "PPP p")}
              </p>
            </div>
          </div>
        </div>

        <Separator />
        {/* update organization */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Update Organization</h3>
          <Card>
            <CardHeader>
              <CardTitle>Update Organization</CardTitle>
              <CardDescription>
                Update your organization's details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardAction>
                <AddOrgModal
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  initialData={organization}
                  onsubmit={handleOrganizationUpdate}
                />
              </CardAction>
            </CardContent>
          </Card>
        </div>

        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Danger Zone</h3>
          <Card className="border-destructive">
            <CardHeader
              className={`${
                organization?.isDeleted ? "text-destructive" : ""
              }`}>
              <CardTitle>
                {organization.isDeleted ? "Restore" : "Delete"} Organization
              </CardTitle>
              <CardDescription>
                {organization.isDeleted
                  ? "Once you restore an organization, it will be available for use. Please be certain."
                  : " Once you delete an organization, there is no going back. Please be certain."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationDeletionDialog
                onDeletionUpdate={onDeletionUpdate}
                organization={organization}
                onRecoveryUpdate={onRecoveryUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgSetting;
