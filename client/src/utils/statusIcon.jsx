import { CalendarClock, CheckCircle2, Clock, Eye, Loader2, PauseCircle, XCircle } from "lucide-react";

export const statusIcons = {
  planning: <CalendarClock className="w-4 h-4 text-blue-600" />,
  pending: <Clock className="w-4 h-4 text-amber-600" />,
  "in-progress": <Loader2 className="w-4 h-4 text-indigo-600" />,
  review: <Eye className="w-4 h-4 text-purple-600" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  "on-hold": <PauseCircle className="w-4 h-4 text-orange-600" />,
  cancelled: <XCircle className="w-4 h-4 text-red-600" />,
};
