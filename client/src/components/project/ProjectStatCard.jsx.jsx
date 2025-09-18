import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProjectStatCard({ title, value, description, icon }) {
  return (
    <Card
      className={cn(
        "w-full shadow-sm border border-slate-500/40 hover:border-orange-600"
      )}>
      <CardContent className="flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
          <span className={cn("text-xl")}>{icon}</span>
        </div>
        <div className="mt-3">
          <p className={cn("text-2xl font-bold")}>{value}</p>
          <p className="text-sm mt-1 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
