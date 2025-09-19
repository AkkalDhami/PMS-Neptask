import React from "react";
import { getRoleBadgeColor } from "../../utils/badgeColor";
import { dateFormater } from "../../utils/dateFormater";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideBadgeCheck, MoreVertical } from "lucide-react";
import {
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "../../features/org/orgApi";
import toast from "react-hot-toast";
import DeleteAlertDialog from "../admin/AlertDailog";
import { MemberRoleForm } from "./ChangememberRole";
const OrgMembercard = ({ member, orgId }) => {
  const [removeMember, { isLoading }] = useRemoveMemberMutation();
  const [updateMemberRole,] = useUpdateMemberRoleMutation();

  const removeMemberHandler = async ({ memberId }) => {
    try {
      console.log({ memberId, orgId });
      const res = await removeMember({ memberId, orgId }).unwrap();
      console.log(res);
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.message || error?.data?.message);
    }
  };

  const memberRoleHandler = async ({ role }) => {
    try {
      const res = await updateMemberRole({
        orgId,
        memberId: member?.user?._id,
        role,
      }).unwrap();
      console.log(res);
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.message || error?.data?.message);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-3 border rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar>
          <AvatarImage
            src={member?.user?.avatar?.url}
            alt={member?.user?.name}
            className={"object-cover rounded-lg"}
          />
          <AvatarFallback className={"rounded-lg"}>
            {member?.user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium flex items-center gap-1">
            {member?.user?.name}{" "}
            {member?.user?.isEmailVerified && (
              <LucideBadgeCheck className={"w-4 h-4  text-green-600"} />
            )}
          </div>

          <p className="text-sm text-muted-foreground">{member?.user?.email}</p>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-4">
        <Badge className={getRoleBadgeColor(member.role)}>
          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
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
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteAlertDialog
          triggerText="Delete oganization"
          title="Remove member from organization"
          isLoading={isLoading}
          onConfirm={() => removeMemberHandler({ memberId: member?.user?._id })}
          description={
            <>
              Are you sure to remove <strong>{member?.user?.name}</strong> from
              this organization?
            </>
          }
        />
        <MemberRoleForm member={member} onRoleUpdate={memberRoleHandler} />
      </div>
    </div>
  );
};

export default OrgMembercard;
