import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import AddOrgModal from "../../components/org/AddOrgModal";
import {
  useDeleteOrgMutation,
  useLazyGetOrgQuery,
} from "../../features/org/orgApi";
import toast from "react-hot-toast";
import { dateFormater } from "../../utils/dateFormater";
import DeleteAlertDialog from "../../components/admin/AlertDailog";
import InviteMemberForm, {
  InviteMemberForm2,
} from "../../components/org/InviteMemberForm";
import { useSendInvitationMutation } from "../../features/invite/inviteApi";

const OrgDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [sendInvitation, { error: inviteError }] = useSendInvitationMutation();
  const { orgId } = params;

  const [trigger, { isLoading, data, error }] = useLazyGetOrgQuery();

  const [deleteOrg, { isLoading: isDeleting, error: deleteOrgError }] =
    useDeleteOrgMutation();

  useEffect(() => {
    if (orgId) {
      trigger(orgId);
    }
  }, [orgId, trigger]);

  useEffect(() => {
    if (error) {
      toast.error(
        error?.data?.message || error?.error || "Something went wrong"
      );
    }
  }, [error]);

  const organization = data?.org;

  const handleOrganizationUpdate = (updatedData) => {
    console.log(updatedData);
  };

  const onDelete = async (id) => {
    console.log(id);
    try {
      const res = await deleteOrg(id).unwrap();
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      navigate("/organization");
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
    }
  };

  // Function to get role badge variant
  const getRoleVariant = (role) => {
    switch (role) {
      case "owner":
        return "bg-orange-500 text-white";
      case "admin":
        return "bg-blue-500 text-white";
      case "member":
        return "bg-green-500 text-white";
      case "viewer":
        return "bg-zinc-500 text-white";
      case "guest":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
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
      const res = await sendInvitation({ data, orgId }).unwrap()
      console.log(res);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.error || error?.data?.message || error?.message);
      console.error(error);
    }
  };
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No organization found</div>;

  if (inviteError) {
    toast.error(inviteError.error?.message || inviteError?.error)
  }
  if (deleteOrgError) {
    toast.error(deleteOrgError.error || deleteOrgError?.error?.message);
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
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
              <DropdownMenuItem className="text-destructive">
                Delete Organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={getPlanVariant(organization.subscription.plan)}>
                {organization.subscription.plan.toUpperCase()}
              </Badge>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Renewal: {dateFormater(organization.subscription.renewalDate)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {organization.members.length}
              </span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all workspaces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {organization.workspaces.length}
              </span>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active workspaces
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="workspaces">
            <Building2 className="h-4 w-4 mr-2" />
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
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="w-full pl-8 pr-4 py-2 border rounded-md"
                    />
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>

                  <InviteMemberForm
                    onInvite={handleInvitationMember}
                    organizationId={organization._id}
                  />
                  {/* <InviteMemberForm2 organizationId={organization._id} /> */}
                </div>

                <Separator />

                <div className="space-y-4">
                  {organization?.members?.map((member) => (
                    <div
                      key={member?.user._id}
                      className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={member?.user?.avatar?.url}
                            alt={member?.user?.name}
                          />
                          <AvatarFallback>
                            {member?.user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member?.user?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member?.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getRoleVariant(member.role)}>
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Joined Date: {dateFormater(member.joinedAt)}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organization.workspaces.map((workspace) => (
                  <Card key={workspace._id} className="overflow-hidden">
                    <div className="h-32 bg-muted"></div>
                    <CardHeader>
                      <CardTitle>{workspace.name}</CardTitle>
                      <CardDescription>Workspace description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {organization.members.slice(0, 3).map((member) => (
                            <Avatar
                              key={member.user._id}
                              className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={member.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {organization.members.length > 3 && (
                            <Avatar className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                +{organization.members.length - 3}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed flex items-center justify-center h-full min-h-[300px]">
                  <Button variant="ghost" className="flex flex-col h-auto p-6">
                    <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span>Create New Workspace</span>
                  </Button>
                </Card>
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
                  <CardHeader className="text-destructive">
                    <CardTitle>Delete Organization</CardTitle>

                    <CardDescription>
                      Once you delete an organization, there is no going back.
                      Please be certain.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DeleteAlertDialog
                      triggerText="Delete Org"
                      isLoading={isDeleting}
                      title={`Delete ${organization.name}?`}
                      description="This will permanently remove the organization and all related data."
                      onConfirm={() => onDelete(organization._id)}
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
