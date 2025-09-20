import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Mail,
  Calendar,
  Users,
  CreditCard,
  Settings,
  Edit,
  MoreVertical,
  Plus,
  Shield,
  Eye,
  User,
  CirclePlus,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AddOrgModal from "../../components/org/AddOrgModal";
import {
  useDeleteOrgMutation,
  useLazyGetOrgQuery,
  useRecoverOrgMutation,
  useUpdateOrgMutation,
} from "../../features/org/orgApi";
import toast from "react-hot-toast";
import { dateFormater } from "../../utils/dateFormater";
import DeleteAlertDialog from "../../components/admin/AlertDailog";
import InviteMemberForm, {
  InviteMemberForm2,
} from "../../components/org/InviteMemberForm";
import { useSendInvitationMutation } from "../../features/invite/inviteApi";
import OrgMembercard from "../../components/org/OrgMembercard";
import OrganizationDeletionDialog from "../../components/org/DeleteOrgDailog";
import OrgAlert from "../../components/org/OrgAlert";
import OrgStatCard from "../../components/org/OrgStatCard";
import WorkspaceForm from "../../components/workspace/WorkspaceForm";
import WorkspaceAction from "../../components/workspace/WorkspaceAction";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";

const OrgDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [sendInvitation, { isError: isInviteError, error: inviteError }] =
    useSendInvitationMutation();
  const { orgId } = params;

  const [updateOrg] = useUpdateOrgMutation();

  const [trigger, { isLoading, data, error }] = useLazyGetOrgQuery();

  const [deleteOrg, { isError: isDeleteOrgError, error: deleteOrgError }] =
    useDeleteOrgMutation();

  const [recoverOrg, { isError: isRecoverOrgError, error: recoverOrgError }] =
    useRecoverOrgMutation();

  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (orgId) {
      trigger(orgId);
    }
  }, [orgId, trigger]);


  const organization = data?.org;
  console.log(organization?.workspaces);

  const handleOrganizationUpdate = async (updatedData) => {
    console.log(updatedData);
    setIsDialogOpen(true);
    try {
      const res = await updateOrg({ orgId, data: updatedData }).unwrap();
      console.log(res);
      toast.success(res?.message);
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
      setIsDialogOpen(false);
    }
  };

  const onDeletionUpdate = async (id) => {
    console.log(id);
    try {
      const res = await deleteOrg({ orgId }).unwrap();
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      navigate("/organization");
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
    }
  };

  console.log("recoverOrgError:", recoverOrgError);
  const onRecoveryUpdate = async () => {
    try {
      const res = await recoverOrg({ orgId }).unwrap();
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
    }
  };

  // Function to get plan badge variant
  const getPlanVariant = (plan) => {
    switch (plan) {
      case "enterprise":
        return "default";
      case "pro":
        return "secondary";
      case "free":
        return "outline";
      default:
        return "outline";
    }
  };

  // Handle Invitation Member
  const handleInvitationMember = async (data) => {
    try {
      console.log(data);
      setOpen(true);
      const res = await sendInvitation({ data, orgId }).unwrap();
      console.log(res);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      setOpen(false);
    } catch (error) {
      toast.error(error?.error || error?.data?.message || error?.message);
      console.error(error);
    }
  };
  if (isLoading)
    return (
      <div className="container mx-auto p-6 min-h-screen w-full flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin mb-4" />
          <p className="text-2xl bg-gradient text-transparent bg-clip-text font-medium">
            Loading organization data...
          </p>
        </div>
      </div>
    );
  if (!data) return <div>No organization found</div>;




  return (
    <div className="container mx-auto py-6 space-y-6">
      {organization?.isDeleted ? <OrgAlert org={organization} /> : null}

      {/* Header Section */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-md">
            <AvatarImage
              src={organization?.logo?.url}
              alt={organization.name}
            />
            <AvatarFallback className="rounded-md">
              <Building2 className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl bg-gradient bg-clip-text text-transparent font-bold">
              {organization.name}
            </h1>
            <p className="text-muted-foreground flex mt-1 items-center gap-1">
              <Mail className="h-4 w-4" />
              {organization.orgEmail}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddOrgModal
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            initialData={organization}
            onsubmit={handleOrganizationUpdate}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Billing Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OrgStatCard
          title={"Subscription Plan"}
          description={`Renewal: ${dateFormater(
            organization?.subscription.renewalDate
          )}`}
          stat={organization?.subscription.plan.toUpperCase()}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <OrgStatCard
          title={"Members"}
          description={`Across all organizations`}
          stat={organization?.members.length}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <OrgStatCard
          title={"Workspaces"}
          description={`Active workspaces`}
          stat={organization?.workspaces.length}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full  grid-cols-4 mb-2 overflow-x-auto">
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="workspaces">
            <Briefcase className="h-4 w-4 mr-2" />
            Workspaces
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>
                Manage members and their permissions in your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex  flex-wrap gap-2.5 justify-between items-center">
                  <div className="relative w-64">
                    <Input
                      type="text"
                      placeholder="Search members..."
                      className="w-full pl-8 pr-4 py-2 border rounded-md"
                    />
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>

                  <InviteMemberForm
                    open={open}
                    setOpen={setOpen}
                    onInvite={handleInvitationMember}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  {organization?.members?.map((member) => (
                    <OrgMembercard
                      orgId={organization?._id}
                      member={member}
                      key={member._id}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspaces Tab */}
        <TabsContent value="workspaces">
          <Card>
            <CardHeader>
              <CardTitle>Organization Workspaces</CardTitle>
              <CardDescription>
                All workspaces belonging to this organization.
              </CardDescription>
              <CardAction>
                <WorkspaceAction orgId={organization._id} />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organization.workspaces.map((workspace) => (
                  <WorkspaceCard workspace={workspace} key={workspace._id} />
                ))}

                <WorkspaceAction orgId={organization._id} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Manage your organization's subscription plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <Badge
                    variant={getPlanVariant(organization.subscription.plan)}
                    className="mt-2">
                    {organization.subscription.plan.toUpperCase()}
                  </Badge>
                </div>
                <Button>Upgrade Plan</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Billing Cycle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">Annual</p>
                    <p className="text-sm text-muted-foreground">
                      Next billing on{" "}
                      {dateFormater(organization.subscription.renewalDate)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">Visa **** 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/2024
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <Shield className="h-6 w-6 mb-2 text-primary" />
                    <h4 className="font-medium">Admin Roles</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Granular permission controls
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <Users className="h-6 w-6 mb-2 text-primary" />
                    <h4 className="font-medium">Unlimited Members</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add as many team members as you need
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <Building2 className="h-6 w-6 mb-2 text-primary" />
                    <h4 className="font-medium">Multiple Workspaces</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create separate workspaces for different teams
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
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
                    <label className="text-sm font-medium">
                      Organization Name
                    </label>
                    <p className="text-muted-foreground">{organization.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Organization Email
                    </label>
                    <p className="text-muted-foreground">
                      {organization.orgEmail}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created On</label>
                    <p className="text-muted-foreground">
                      {dateFormater(organization.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="text-muted-foreground">
                      {dateFormater(organization.updatedAt)}
                    </p>
                  </div>
                </div>
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
                      {organization.isDeleted ? "Restore" : "Delete"}{" "}
                      Organization
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDetails;
