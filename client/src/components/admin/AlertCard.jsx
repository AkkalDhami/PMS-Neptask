import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LucideTriangleAlert } from "lucide-react";
const AlertCard = ({ title = "", description = "" }) => {
  return (
    <Alert className="bg-amber-500/10 border-amber-500 text-amber-700">
      <LucideTriangleAlert size={38} className="mt-1" />
      <AlertTitle className={'text-xl font-semibold'}>{title}</AlertTitle>
      <AlertDescription>
        <p className="text-amber-600">{description}</p>
      </AlertDescription>
    </Alert>
  );
};

export default AlertCard;
