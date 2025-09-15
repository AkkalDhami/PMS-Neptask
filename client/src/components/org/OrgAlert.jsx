import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LucideTriangleAlert } from "lucide-react";
import React from "react";
import { dateFormater } from "../../utils/dateFormater";
import { getDaysRemaining } from "../../utils/getDaysRemaining";

const OrgAlert = ({ org }) => {
  if (!org) return null;
  return (
    <Alert className="bg-amber-500/10 border-amber-500 text-amber-700">
      <LucideTriangleAlert size={34} />
      <AlertTitle>Organization Delete Alert [{org?.name}]</AlertTitle>
      <AlertDescription>
        <p className="text-amber-600">
          This organization is scheduled for deletion on{" "}
          <span className="text-amber-600 font-semibold">
            {dateFormater(org?.scheduledDeletionAt)}
          </span>
          . Please take necessary actions to avoid data loss. <br />
          <strong>
            Remaining days: {getDaysRemaining(org?.scheduledDeletionAt)}.
          </strong>
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default OrgAlert;
