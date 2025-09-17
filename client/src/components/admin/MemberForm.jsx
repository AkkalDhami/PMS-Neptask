"use client";

import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MemberSelect } from "./MemberSelect";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function MemberForm({ control, users, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  return (
    <div className="space-y-4">
      <Label>Members</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-center flex-wrap gap-4 border p-3 rounded-lg">
          {/* Member Select */}
          <div className="flex-1 min-w-[200px]">
            <Controller
              control={control}
              name={`members.${index}.user`}
              defaultValue={field.user || ""}
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

          {/* Role Select */}
          <div className="w-40">
            <Controller
              control={control}
              name={`members.${index}.role`}
              defaultValue={field.role || "member"}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}>
            <X />
          </Button>
        </div>
      ))}

      {/* Add Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ user: "", role: "member" })}>
        + Add Member
      </Button>

      {errors.members && typeof errors.members.message === "string" && (
        <p className="text-sm text-red-500">{errors.members.message}</p>
      )}
    </div>
  );
}
