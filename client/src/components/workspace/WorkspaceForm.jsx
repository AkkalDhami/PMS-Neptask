import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, Loader2, Edit2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workspaceSchema, workspaceSchema2 } from "../../schemas/workspace";

export default function WorkspaceForm({
  initialData = null,
  onSubmit,
  fromWorkspace = false,
  organizations = [],
}) {
  const colorOptions = [
    "#FF5733", // Vibrant Orange
    "#33B5FF", // Bright Blue
    "#28A745", // Green
    "#FFC107", // Amber
    "#6F42C1", // Purple
    "#E83E8C", // Pink
    "#FD7E14", // Deep Orange
    "#343A40", // Dark Gray
    "#0D6EFD", // Bootstrap Blue
  ];

  const form = useForm({
    resolver: zodResolver(fromWorkspace ? workspaceSchema2 : workspaceSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      color: "#FF5733",
      isActive: true,
      organization: "",
    },
  });

  const [apiError, setApiError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ data, isUpdate: initialData  });
      setOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      setApiError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {initialData ? (
            <>
              <Edit2 className="h-4 w-4" /> Update Workspace
            </>
          ) : (
            <>
              <CirclePlus className="h-4 w-4" /> Add Workspace
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Update Workspace" : "Create Workspace"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update details of your workspace"
              : "Fill in details to create a new workspace"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Workspace name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Workspace description"
                      {...field}
                      className="resize-none"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Theme</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              field.value === color
                                ? `ring-2 ring-offset-2 ring-primary`
                                : "border-gray-200 hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="max-w-[100px]"
                          type="hidden"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* select organization */}
            {fromWorkspace && (
              <FormField
                className={"w-full"}
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization *</FormLabel>
                    <Select
                      className={"w-full p-2"}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations?.map((org) => (
                          <SelectItem
                            className="flex items-center gap-2"
                            key={org?._id}
                            value={org._id}>
                            <Avatar className="h-8 w-8 font-medium rounded-lg">
                              <AvatarImage
                                src={org.logo?.url}
                                className={"object-cover"}
                              />
                              <AvatarFallback
                                className={
                                  "rounded-lg bg-primary dark:text-black text-white"
                                }>
                                {org?.name?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Workspace</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      When checked, this workspace will be visible and
                      accessible to members.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {apiError && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-200 rounded-md">
                {apiError}
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{initialData ? "Update" : "Create"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
