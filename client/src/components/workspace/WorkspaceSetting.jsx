import { AlertTriangle, Download, RefreshCw, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
const WorkspaceSetting = ({ workspace }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");

  const handleDeleteWorkspace = async () => {
    if (!deletionReason) {
      return;
    }

    try {
      setIsDeleting(false);
      setDeletionReason("");
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const handleRecoverWorkspace = async () => {
    try {
      // This would be an API call in a real application
      // await recoverWorkspace(data?.workspace._id);
    } catch (error) {
      console.error("Error recovering workspace:", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>
            Manage advanced workspace settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Danger Zone</h3>

              <div className="flex flex-col sm:flex-row items-start justify-between p-4 border border-destructive rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium text-destructive">
                    {workspace?.isDeleted
                      ? "Recover this workspace"
                      : "Delete this workspace"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {workspace?.isDeleted
                      ? "Once you recover a workspace, you can continue to use it."
                      : "Once you delete a workspace, there is no going back.  Please be certain."}
                  </p>
                </div>
                {workspace?.isDeleted ? (
                  <Button
                    variant="destructive"
                    className="mt-4 sm:mt-0"
                    onClick={() => handleRecoverWorkspace()}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Recover Workspace
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="mt-4 sm:mt-0"
                    onClick={() => setIsDeleting(true)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Workspace
                  </Button>
                )}
              </div>
            </div>
            <Separator />
          </>
        </CardContent>
      </Card>
     
    </>
  );
};

export default WorkspaceSetting;
