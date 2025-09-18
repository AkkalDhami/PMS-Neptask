import {
  CheckSquare,
  Percent,
  AlertCircle,
  ClipboardList,
  Hourglass,
  Loader2,
  SearchCheck,
  CheckCircle2,
  PauseCircle,
  XCircle,
  AlertOctagon,
} from "lucide-react";
import ProjectStatCard from "./ProjectStatCard.jsx";
import { RiTimerLine } from "react-icons/ri";

export default function ProjectStats({ stats, progress = 0 }) {
  const statusIcons = {
    planning: <ClipboardList className="h-5 w-5 text-blue-500" />,
    pending: <Hourglass className="h-5 w-5 text-yellow-500" />,
    "in-progress": <Loader2 className="h-5 w-5 text-sky-500" />,
    review: <SearchCheck className="h-5 w-5 text-purple-500" />,
    completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    "on-hold": <PauseCircle className="h-5 w-5 text-orange-500" />,
    cancelled: <XCircle className="h-5 w-5 text-red-500" />,
    overdue: <RiTimerLine className="h-5 w-5 text-red-500" />,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProjectStatCard
        title={"Total Tasks"}
        value={stats.totalTasks}
        description={"All project tasks"}
        icon={<CheckSquare className="h-5 w-5 text-indigo-500" />}
      />
      <ProjectStatCard
        title={"Completed Tasks"}
        value={stats.completed}
        description={"All completed tasks"}
        icon={statusIcons["completed"]}
      />

      <ProjectStatCard
        title={"In Progress Tasks"}
        value={stats.inProgress}
        description={"All in progress tasks"}
        icon={statusIcons["in-progress"]}
      />

      <ProjectStatCard
        title={"Pending Tasks"}
        value={stats.pending}
        description={"All pending tasks"}
        icon={statusIcons["pending"]}
      />

      <ProjectStatCard
        title={"Project Completion Rate"}
        value={`${progress}%`}
        description={"Project completion rate"}
        icon={<Percent className="h-5 w-5 text-emerald-600" />}
      />

      <ProjectStatCard
        title={"Overdue Tasks"}
        value={stats.overdueTasks}
        description={"All overdue tasks"}
        icon={statusIcons["overdue"]}
      />

      <ProjectStatCard
        title={"High Priority Tasks"}
        value={stats.highPriority}
        description={"High priority tasks"}
        icon={<AlertOctagon className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
}
