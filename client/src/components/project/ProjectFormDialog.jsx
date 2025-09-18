import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Edit,
  Loader2,
  Tag,
  X,
  CalendarClock, // planning
  Clock, // pending
  Loader, // in-progress
  Eye, // review
  CheckCircle2, // completed
  PauseCircle, // on-hold
  XCircle,
  CirclePlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { projectFormSchema } from "../../schemas/projectSchema";
import { useGetWorkspacesQuery } from "../../features/workspace/workspaceApi";
import { MdOutlineOfflineBolt } from "react-icons/md";
import { priorityIcons } from "../../utils/priorityIcon";
import { statusIcons } from "../../utils/statusIcon";

const ProjectFormDialog = ({
  workspaceId = "",
  project,
  onSubmit = () => {},
  triggerVariant = "default",
}) => {
  const { data } = useGetWorkspacesQuery();
  const [isOpen, setIsOpen] = React.useState(false);
  const [tags, setTags] = React.useState(project?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "planning",
      priority: project?.priority || "medium",
      startDate: project?.startDate ? new Date(project.startDate) : null,
      dueDate: project?.dueDate ? new Date(project.dueDate) : null,
      workspace: project?.workspace?._id || workspaceId || "",
      tags: project?.tags || [],
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || "",
        status: project.status,
        priority: project.priority,
        startDate: project.startDate ? new Date(project.startDate) : null,
        dueDate: project.dueDate ? new Date(project.dueDate) : null,
        workspace: project.workspace || workspaceId,
      });
      setTags(project.tags || []);
    } else {
      form.reset({
        name: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: null,
        dueDate: null,
        workspace: workspaceId || "",
      });
      setTags([]);
    }
  }, [project, form, isOpen, workspaceId]);

  // Set workspace value when workspaceId prop changes
  useEffect(() => {
    if (workspaceId) {
      form.setValue("workspace", workspaceId);
    }
  }, [workspaceId, form]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmitHandler = async (values) => {
    setIsLoading(true);
    const payload = {
      ...values,
      tags,
      workspace: workspaceId || values.workspace,
    };
    await onSubmit(payload);
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={project ? "outline" : triggerVariant}>
          {project ? (
            <Edit className="h-4 w-4" />
          ) : (
            <CirclePlus className="h-4 w-4" />
          )}
          {project ? "" : "Add Project"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update your project details below."
              : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
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
                      placeholder="Describe your project..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">
                          <div className="flex items-center gap-2 text-blue-500">
                            {statusIcons.planning}
                            <span>Planning</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2 text-amber-500">
                            {statusIcons.pending}
                            <span>Pending</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <div className="flex items-center gap-2 text-indigo-500">
                            {statusIcons["in-progress"]}
                            <span>In Progress</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="review">
                          <div className="flex items-center gap-2 text-purple-500">
                            {statusIcons.review}
                            <span>Review</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2 text-green-600">
                            {statusIcons.completed}
                            <span>Completed</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="on-hold">
                          <div className="flex items-center gap-2 text-orange-600">
                            {statusIcons["on-hold"]}
                            <span>On Hold</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center gap-2 text-red-600">
                            {statusIcons.cancelled}
                            <span>Cancelled</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2 text-amber-500">
                            {priorityIcons.low}
                            <span>Low</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2 text-green-500">
                            {priorityIcons.medium}
                            <span>Medium</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2 text-orange-500">
                            {priorityIcons.high}
                            <span>High</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center gap-2 text-red-500">
                            {priorityIcons.urgent}
                            <span>Urgent</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
              <FormField
                control={form.control}
                name="workspace"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Workspace *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!!workspaceId}>
                      <FormControl>
                        <SelectTrigger className="w-full py-5.5">
                          <SelectValue
                            placeholder={
                              workspaceId
                                ? "Workspace is pre-selected"
                                : "Select a workspace"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.workspaces?.map((ws) => (
                          <SelectItem key={ws._id} value={ws._id}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex items-center text-white justify-center w-8 h-8 rounded-lg`}
                                style={{ backgroundColor: ws.color }}>
                                {ws.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>{ws.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {workspaceId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Workspace is pre-selected based on current context
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            return startDate
                              ? date < startDate
                              : date < new Date("1900-01-01");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FormItem>
            {/* 
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Project</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      When checked, this project will be visible and accessible
                      to members.
                    </p>
                  </div>
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {project ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{project ? "Update Project" : "Create Project"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
