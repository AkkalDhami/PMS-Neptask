
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from "lucide-react";
export const priorityIcons = {
  urgent: <AlertCircle className="w-4 h-4 text-red-600" />,
  high: <ArrowUpCircle className="w-4 h-4 text-orange-500" />,
  medium: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  low: <ArrowDownCircle className="w-4 h-4 text-amber-600" />,
};
