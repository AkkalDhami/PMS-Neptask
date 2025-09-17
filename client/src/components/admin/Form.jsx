"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemberSelect } from "./MemberSelect"; // your existing component
import { Label } from "@/components/ui/label";

const schema = z.object({
  members: z
    .array(
      z.object({
        user: z.string().nonempty("Member is required"),
        role: z.string().nonempty("Role is required"),
      })
    )
    .min(1, "At least one member must be added"),
});

export function AddMemberDialog({
  users = [],
  context = "workspace",
  onSubmit,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      members: [
        {
          user: "",
          role: "",
        },
      ],
    },
  });

  const members = watch("members");

  // Handle adding a new member
  const handleAdd = () => {
    // Remove any existing errors before adding new ones
    setValue(
      "members",
      members.filter((m) => m.user?._id !== "")
    );

    // Add the new empty member
    setValue("members", [...members, { user: "", role: "" }]);
  };

  // Handle removing a member
  const handleRemove = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setValue("members", newMembers);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add Members to {context.charAt(0).toUpperCase() + context.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[60vh] overflow-y-auto">
          {members.map((field, index) => (
            <div
              key={index}
              className="flex items-center flex-wrap gap-4 border p-3 rounded-lg">
              {/* Member Select */}
              <div className="flex-1">
                <Label>Member</Label>
                <Controller
                  control={control}
                  name={`members.${index}.user`}
                  render={({ field }) => (
                    <MemberSelect
                      data={users}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.members?.[index]?.user && (
                  <p className="text-sm text-red-500">
                    {errors.members[index].user.message}
                  </p>
                )}
              </div>

              {/* Remove button */}
              {members.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(index)}>
                  <X />
                </Button>
              )}
            </div>
          ))}
          {/* Error messages for invalid members */}
          {errors.members && typeof errors.members.message === "string" && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              <p>{errors.members.message}</p>
              {Object.entries(errors.members).map(
                ([memberIndex, errorMessage]) => (
                  <div key={memberIndex}>
                    <span>Member #</span>
                    <span className="font-medium">{memberIndex + 1}</span>
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )
              )}
            </div>
          )}
        </form>

        <div className="flex justify-between items-center">
          <Button type="button" variant="secondary" onClick={handleAdd}>
            + Add Another
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
