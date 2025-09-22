import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Edit3,
  MoreHorizontal,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Flag,
  Users,
  Sun,
  Moon,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock data based on your schema
const mockTask = {
  _id: "task123",
  title: "Implement user authentication system",
  description:
    "Create a secure authentication system with JWT tokens, password hashing, and role-based access control. The system should support login, registration, and password recovery.",
  project: {
    _id: "proj123",
    name: "Website Redesign",
  },
  category: "Development",
  assignedTo: {
    _id: "user456",
    name: "Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  reporter: {
    _id: "user123",
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  status: "in-progress",
  priority: "high",
  repeat: "none",
  remainder: "0",
  startDate: "2023-10-15",
  dueDate: "2023-10-25",
  completedAt: null,
  comments: [
    {
      _id: "comment1",
      user: {
        _id: "user123",
        name: "John Doe",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      content:
        "Make sure to include rate limiting on the authentication endpoints.",
      createdAt: "2023-10-16T14:30:00Z",
    },
    {
      _id: "comment2",
      user: {
        _id: "user456",
        name: "Jane Smith",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      content:
        "I've started working on the JWT implementation. Should have it ready for review by tomorrow.",
      createdAt: "2023-10-17T09:15:00Z",
    },
  ],
  attachments: [
    {
      _id: "attach1",
      fileName: "auth_wireframe.pdf",
      fileUrl: "#",
      filetype: "pdf",
      fileSize: "2.4 MB",
      uploadedBy: "user123",
      uploadedAt: "2023-10-15T10:30:00Z",
    },
    {
      _id: "attach2",
      fileName: "api_specs.png",
      fileUrl: "#",
      filetype: "image",
      fileSize: "1.2 MB",
      uploadedBy: "user456",
      uploadedAt: "2023-10-16T14:45:00Z",
    },
  ],
  subtasks: [
    {
      _id: "subtask1",
      title: "Set up JWT authentication",
      completed: true,
    },
    {
      _id: "subtask2",
      title: "Implement password hashing",
      completed: true,
    },
    {
      _id: "subtask3",
      title: "Create login UI component",
      completed: false,
    },
    {
      _id: "subtask4",
      title: "Add rate limiting to auth endpoints",
      completed: false,
    },
  ],
  notes: [
    {
      _id: "note1",
      content: "Use bcrypt for password hashing with salt rounds set to 12.",
      createdAt: "2023-10-15T11:20:00Z",
      createdBy: "user123",
    },
  ],
  createdAt: "2023-10-15T09:00:00Z",
  updatedAt: "2023-10-17T09:15:00Z",
};

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    value: "completed",
    label: "Completed",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
];

const priorityOptions = [
  {
    value: "low",
    label: "Low",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    icon: Flag,
  },
  {
    value: "medium",
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: Flag,
  },
  {
    value: "high",
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    icon: Flag,
  },
  {
    value: "urgent",
    label: "Urgent",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: AlertCircle,
  },
];

// Custom Button Component
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      {children}
    </button>
  );
};

// Custom Card Component
const Card = ({ className = "", ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
};

const CardHeader = ({ className = "", ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
};

const CardTitle = ({ className = "", ...props }) => {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
};

const CardContent = ({ className = "", ...props }) => {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
};

// Custom Badge Component
const Badge = ({ variant = "default", className = "", ...props }) => {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

// Custom Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Custom Textarea Component
const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Custom Avatar Component
const Avatar = ({ className = "", ...props }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  );
};

const AvatarImage = ({ className = "", ...props }) => {
  return (
    <img className={`aspect-square h-full w-full ${className}`} {...props} />
  );
};

const AvatarFallback = ({ className = "", ...props }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
      {...props}
    />
  );
};

// Custom Dropdown Menu Component
const DropdownMenu = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border bg-popover shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ className = "", ...props }) => {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    />
  );
};
const getStatusInfo = (status) => {
  const statusObj = statusOptions.find((s) => s.value === status);
  return statusObj || { label: "Unknown", color: "bg-gray-100 text-gray-800" };
}

const TaskDetailPage = () => {
  const [task, setTask] = useState(mockTask);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleStatusChange = (newStatus) =>
    setTask({ ...task, status: newStatus });
  const handlePriorityChange = (newPriority) =>
    setTask({ ...task, priority: newPriority });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      _id: `comment${task.comments.length + 1}`,
      user: task.reporter, // mock current user
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    setTask({ ...task, comments: [...task.comments, comment] });
    setNewComment("");
  };

  const toggleSubtask = (id) => {
    setTask({
      ...task,
      subtasks: task.subtasks.map((s) =>
        s._id === id ? { ...s, completed: !s.completed } : s
      ),
    });
  };

  if (!mounted) return null;

  const completed = task.subtasks.filter((s) => s.completed).length;
  const total = task.subtasks.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-3">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="mr-2">
            <Edit3 size={16} className="mr-1" /> Edit
          </Button>
          <DropdownMenu
            trigger={
              <Button variant="outline" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            }>
            <DropdownMenuItem>Duplicate task</DropdownMenuItem>
            <DropdownMenuItem>Move to project</DropdownMenuItem>
            <DropdownMenuItem>Add to templates</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-6">
                {/* Title + Status */}
                <div className="flex items-start justify-between">
                  {isEditing ? (
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                  )}
                  <Badge className={getStatusInfo(task.status).color}>
                    {getStatusInfo(task.status).label}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  {isEditing ? (
                    <>
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setTask({
                              ...task,
                              title: editedTitle,
                              description: editedDescription,
                            });
                            setIsEditing(false);
                          }}>
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">{task.description}</p>
                  )}
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsEditing(true)}>
                      <Edit3 size={14} className="mr-1" /> Edit description
                    </Button>
                  )}
                </div>

                {/* Subtasks with Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      <CheckSquare size={18} className="mr-2" /> Subtasks
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {completed}/{total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-accent rounded-full mb-3">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="space-y-1">
                    {task.subtasks.map((s) => (
                      <div
                        key={s._id}
                        className="flex items-center px-2 py-1 rounded hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={s.completed}
                          onChange={() => toggleSubtask(s._id)}
                          className="mr-2"
                        />
                        <span
                          className={
                            s.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }>
                          {s.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <h3 className="font-medium flex items-center mb-2">
                    <Paperclip size={18} className="mr-2" /> Attachments
                  </h3>
                  <div className="space-y-2">
                    {task.attachments.map((a) => (
                      <div
                        key={a._id}
                        className="flex items-center p-2 rounded bg-accent">
                        <div className="h-8 w-8 flex items-center justify-center rounded bg-primary/10 text-primary mr-3">
                          {a.filetype === "pdf" ? (
                            <FileText size={16} />
                          ) : (
                            <img src={a.fileUrl} alt="" className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="truncate text-sm font-medium">
                            {a.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {a.fileSize}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardContent className="space-y-5">
                <h3 className="font-medium flex items-center">
                  <MessageSquare size={18} className="mr-2" /> Comments
                </h3>
                {task.comments.map((c) => (
                  <div key={c._id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.user.avatar} />
                      <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-accent rounded p-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{c.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p>{c.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.reporter.avatar} />
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        disabled={!newComment.trim()}
                        onClick={handleAddComment}>
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="space-y-5">
                <h3 className="font-medium">Task Actions</h3>
                {/* Status */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <Button
                        key={s.value}
                        size="sm"
                        variant={
                          task.status === s.value ? "default" : "outline"
                        }
                        onClick={() => handleStatusChange(s.value)}>
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Priority */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <div className="flex flex-wrap gap-2">
                    {priorityOptions.map((p) => (
                      <Button
                        key={p.value}
                        size="sm"
                        variant={
                          task.priority === p.value ? "default" : "outline"
                        }
                        onClick={() => handlePriorityChange(p.value)}>
                        <p.icon size={14} className="mr-1" /> {p.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="w-full">
                  <CheckCircle size={16} className="mr-1" /> Mark complete
                </Button>
                <Button variant="ghost" className="w-full text-destructive">
                  Delete Task
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4">
                <h3 className="font-medium">Activity</h3>
                <div className="text-sm space-y-2">
                  <p>
                    <span className="font-medium">{task.reporter.name}</span>{" "}
                    created task
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
