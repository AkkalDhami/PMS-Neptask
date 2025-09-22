import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  Plus,
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateTaskMutation } from "../../features/task/taskApi";

// Zod validation schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  category: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  repeat: z.enum(["daily", "weekly", "monthly", "yearly", "none"]),
  remainder: z.string(),
  startDate: z.date().optional().nullable(),
  dueDate: z.date().optional().nullable(),
});

const noteSchema = z.object({
  title: z.string().min(1, "Note title is required").max(100, "Title too long"),
  description: z.string().max(6000, "Description too long").optional(),
});

const CreateEditTaskPage = ({ isEdit = false, taskData = null }) => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues:
      isEdit && taskData
        ? {
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            assignedTo: taskData.assignedTo,
            status: taskData.status,
            priority: taskData.priority,
            repeat: taskData.repeat,
            remainder: taskData.remainder,
            startDate: taskData.startDate ? new Date(taskData.startDate) : null,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          }
        : {
            status: "pending",
            priority: "medium",
            repeat: "none",
            remainder: "0",
          },
  });

  const [createTask] = useCreateTaskMutation();

  // Notes state
  const [notes, setNotes] = useState(isEdit && taskData ? taskData.notes : []);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [noteErrors, setNoteErrors] = useState({});

  // Attachments state
  const [attachments, setAttachments] = useState(
    isEdit && taskData ? taskData.attachments : []
  );
  const [attachmentTab, setAttachmentTab] = useState("upload");
  const [fileUploads, setFileUploads] = useState([]);
  const [linkUrl, setLinkUrl] = useState("");

  // Subtasks state
  const [subtasks, setSubtasks] = useState(
    isEdit && taskData ? taskData.subtasks : []
  );
  const [newSubtask, setNewSubtask] = useState("");

  // Watch form values
  const formValues = watch();

  // Validate note
  const validateNote = () => {
    try {
      noteSchema.parse(newNote);
      setNoteErrors({});
      return true;
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setNoteErrors(errors);
      return false;
    }
  };

  // Add note
  const addNote = () => {
    if (validateNote()) {
      setNotes([...notes, { ...newNote, id: Date.now() }]);
      setNewNote({ title: "", description: "" });
    }
  };

  // Remove note
  const removeNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      name: file.name,
      type: "file",
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setFileUploads([...fileUploads, ...newFiles]);
  };

  // Remove uploaded file
  const removeUploadedFile = (index) => {
    setFileUploads(fileUploads.filter((_, i) => i !== index));
  };

  // Add link attachment
  const addLinkAttachment = () => {
    if (linkUrl.trim()) {
      setAttachments([
        ...attachments,
        {
          name: "Link Attachment",
          type: "link",
          url: linkUrl,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      setLinkUrl("");
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Add subtask
  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { title: newSubtask, completed: false, id: Date.now() },
      ]);
      setNewSubtask("");
    }
  };

  // Remove subtask
  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Prepare all attachments (both uploaded files and links)
    const allAttachments = [
      ...attachments,
      ...fileUploads.map((file) => ({
        name: file.name,
        type: "file",
        url: file.url,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      })),
    ];

    // Prepare data for API
    const taskData = {
      ...data,
      project: projectId,
      subtasks,
      notes,
      attachments: allAttachments,
    };
    console.log(taskData, data);
    try {
      const res = await createTask({ data: taskData }).unwrap();

      console.log(res);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Task" : "Create New Task"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Task Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>
                  Provide the essential information for your task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter task title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe the task in detail"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register("category")}
                    placeholder="e.g., Design, Development, Testing"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subtasks</CardTitle>
                <CardDescription>
                  Break down your task into smaller, manageable items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask"
                  />
                  <Button type="button" onClick={addSubtask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <div
                      key={subtask.id || index}
                      className="flex items-center justify-between p-2 border rounded">
                      <span>{subtask.title}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubtask(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Add additional information or context about this task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note-title">Note Title *</Label>
                  <Input
                    id="note-title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    placeholder="Note title"
                    className={noteErrors.title ? "border-red-500" : ""}
                  />
                  {noteErrors.title && (
                    <p className="text-red-500 text-sm">{noteErrors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-description">Description</Label>
                  <Textarea
                    id="note-description"
                    value={newNote.description}
                    onChange={(e) =>
                      setNewNote({ ...newNote, description: e.target.value })
                    }
                    placeholder="Note description"
                    rows={3}
                    className={noteErrors.description ? "border-red-500" : ""}
                  />
                  {noteErrors.description && (
                    <p className="text-red-500 text-sm">
                      {noteErrors.description}
                    </p>
                  )}
                </div>

                <Button type="button" onClick={addNote}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>

                <div className="space-y-4 mt-4">
                  {notes.map((note, index) => (
                    <Card key={note.id || index}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {note.title}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNote(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-muted-foreground">
                          {note.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Add files or links related to this task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={attachmentTab} onValueChange={setAttachmentTab}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="link">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      By Link
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="attachments"
                        className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer">
                        <Upload className="h-4 w-4" />
                        Select Files
                      </Label>
                      <Input
                        id="attachments"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2">
                      {fileUploads.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {file.size
                                  ? `${(file.size / 1024).toFixed(1)} KB`
                                  : "Unknown size"}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUploadedFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="link" className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Paste URL here"
                      />
                      <Button type="button" onClick={addLinkAttachment}>
                        Add Link
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Attachments</h4>
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        {attachment.type === "link" ? (
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attachment.type === "link"
                              ? "URL"
                              : attachment.size
                              ? `${(attachment.size / 1024).toFixed(1)} KB`
                              : "Unknown size"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Task Properties */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Properties</CardTitle>
                <CardDescription>Configure your task settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={formValues.assignedTo || ""}
                    onValueChange={(value) => setValue("assignedTo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">John Doe</SelectItem>
                      <SelectItem value="user2">Jane Smith</SelectItem>
                      <SelectItem value="user3">Robert Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formValues.status}
                    onValueChange={(value) => setValue("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formValues.priority}
                    onValueChange={(value) => setValue("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeat">Repeat</Label>
                  <Select
                    value={formValues.repeat}
                    onValueChange={(value) => setValue("repeat", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repeat option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remainder">Reminder</Label>
                  <Select
                    value={formValues.remainder}
                    onValueChange={(value) => setValue("remainder", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Set reminder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates</CardTitle>
                <CardDescription>
                  Set start and due dates for your task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formValues.startDate && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formValues.startDate ? (
                          format(formValues.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formValues.startDate}
                        onSelect={(date) => setValue("startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formValues.dueDate && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formValues.dueDate ? (
                          format(formValues.dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formValues.dueDate}
                        onSelect={(date) => setValue("dueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEditTaskPage;
