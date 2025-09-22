import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdOutlineOfflineBolt } from "react-icons/md";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, CalendarIcon, Pencil, Loader2, CirclePlus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetProjectsQuery } from "../../features/project/projectApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { taskFormSchema } from "../../schemas/taskSchema";
import { statusIcons } from "../../utils/statusIcon";

const TaskDialog = ({
  trigger,
  onSubmit,
  initialData,
  status = "pending",
  fromTask = false,
}) => {

  const params = useParams();
  const { projectId } = params;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const { data } = useGetProjectsQuery();
  const projects = data?.projects || [];

  // Initialize form
  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      project: initialData?.project || projectId || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      assignedTo: initialData?.assignedTo?._id || "",
      status: initialData?.status || status,
      priority: initialData?.priority || "medium",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : undefined,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    },
  });

  // Watch project field to update team members
  const watchedProject = form.watch("project");

  // Update team members when project changes
  useEffect(() => {
    if (watchedProject) {
      const project = projects?.find((p) => p._id === watchedProject);
      setSelectedProject(project);

      if (project?.members) {
        const members = project.members.map((member) => ({
          _id: member.user?._id || member.user,
          name: member.user?.name || "Unknown User",
          role: member.role,
        }));
        setTeamMembers(members);
      } else {
        setTeamMembers([]);
      }
    } else {
      setTeamMembers([]);
      setSelectedProject(null);
    }
  }, [watchedProject, projects]);

  useEffect(() => {
    if (watchedProject) {
      form.setValue("assignedTo", "");
    }
  }, [watchedProject, form]);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const projectExists = projects.some((p) => p._id === projectId);
      if (projectExists) {
        form.setValue("project", projectId);
      }
    }
  }, [projectId, projects, form]);

  const submitHandler = async (values) => {
    setLoading(true);
    try {
      await onSubmit(values);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectName = () => {
    if (projectId) {
      const project = projects?.find((p) => p._id === projectId);
      return project ? project.name : "Current Project";
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={fromTask ? "ghost" : "default"}>
            {initialData ? (
              <>
                <Pencil className="h-4 w-4" />
                Edit Task
              </>
            ) : (
              <>
                <CirclePlus className={`h-4 w-4`} />
                {!fromTask && "Add Task"}
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the details of your task."
              : projectId
              ? `Add a new task to ${getProjectName()}. Click create when you're done.`
              : "Add a new task to your project. Click create when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-4">
            {/* Conditionally render project selection */}
            {!projectId && (
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full p-3.5">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            <div
                              className="flex items-center justify-center gap-2 w-8 h-8 rounded-lg text-white"
                              style={{
                                backgroundColor: project?.workspace?.color,
                              }}>
                              {project?.name?.charAt(0)?.toUpperCase()}
                            </div>{" "}
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Display current project name if projectId is provided */}
            {projectId && (
              <div className="space-y-2">
                <FormLabel>Project</FormLabel>
                <div className="flex items-center p-2 border rounded-md bg-muted/50">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-white mr-2"
                    style={{
                      backgroundColor:
                        selectedProject?.workspace?.color || "#3b82f6",
                    }}>
                    {selectedProject?.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <span className="font-medium">
                    {selectedProject?.name || getProjectName()}
                  </span>
                </div>
                <input type="hidden" name="project" value={projectId} />
              </div>
            )}

            {/* Task Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assign To */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Assign To *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedProject && !projectId}>
                    <FormControl>
                      <SelectTrigger className="w-full py-5">
                        <SelectValue
                          placeholder={
                            selectedProject || projectId
                              ? "Select a member"
                              : "Select project first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member._id} value={member._id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage src={member?.avatar?.url} />
                              <AvatarFallback className="text-white rounded-lg bg-orange-600">
                                {member.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {member.name}{" "}
                              {member.role ? `(${member.role})` : ""}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      {teamMembers.length === 0 && (
                        <SelectItem  disabled>
                          No members available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2 text-amber-500">
                            <MdOutlineOfflineBolt
                              className={"text-amber-500"}
                            />
                            <span>Low</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2 text-green-500">
                            <MdOutlineOfflineBolt
                              className={"text-green-500"}
                            />
                            <span>Medium</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2 text-orange-500">
                            <MdOutlineOfflineBolt
                              className={"text-orange-500"}
                            />
                            <span>High</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center gap-2 text-red-500">
                            <MdOutlineOfflineBolt className={"text-red-500"} />
                            <span>Urgent</span>
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
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2 text-green-600">
                            {statusIcons.completed}
                            <span>Completed</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
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
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
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
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  initialData ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  )
                ) : initialData ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
