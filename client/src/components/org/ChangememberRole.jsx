import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LucideUserPen, User } from "lucide-react";


import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";
import { Loader2, UserCog, Shield, Eye, UserCheck, Edit3 } from "lucide-react";

// Validation schema
const roleFormSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer", "guest", "manager"], {
    message: "Please select a role",
  }),
});

const MemberRoleForm = ({ member, currentUserRole, onRoleUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      role: member?.role || "member",
    },
  });

  // Update form when member changes
  useEffect(() => {
    if (member) {
      form.reset({
        role: member.role,
      });
    }
  }, [member, form]);

  const getRoleDescription = (role) => {
    switch (role) {
      case "owner":
        return "Full organization control, can manage everything including deleting the organization";
      case "admin":
        return "Can manage members, workspaces, and organization settings";
      case "member":
        return "Can create and edit content in assigned workspaces";
      case "viewer":
        return "Can view content but cannot make changes";
      case "guest":
        return "Limited access to specific resources only";
      default:
        return "";
    }
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await onRoleUpdate(values);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="h-4 w-4 mr-2" />
          Change Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Update the role for {member?.user?.name} in your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 border rounded-lg mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member?.user?.avatar} alt={member?.user?.name} />
            <AvatarFallback>
              {member?.user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{member?.user?.email}</p>
            <Badge variant="outline" className="mt-1 capitalize">
              Current: {member.role}
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentUserRole === "owner" && (
                        <SelectItem value="owner">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Owner</span>
                          </div>
                        </SelectItem>
                      )}
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="manager">
                        <div className="flex items-center gap-2">
                          <LucideUserPen className="h-4 w-4" />
                          <span>Manager</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Member</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>Viewer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="guest">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Guest</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {form.watch("role") &&
                      getRoleDescription(form.watch("role"))}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.formState.isDirty}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { MemberRoleForm };
