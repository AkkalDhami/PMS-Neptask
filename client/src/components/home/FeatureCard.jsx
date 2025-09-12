import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function FeatureCard({ feature }) {
  return (
    <Card className="group relative w-full rounded-2xl border border-zinc-500/40 bg-white hover:border-orange-500 dark:bg-slate-950 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-col items-start gap-4">
        <div
          className={`w-14 h-14 rounded-lg flex items-center justify-center ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
          {feature.icon}
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 text-[16px] dark:text-gray-300 leading-relaxed">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
