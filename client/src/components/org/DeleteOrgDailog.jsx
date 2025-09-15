"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Trash2, Undo2, Calendar, ShieldAlert } from "lucide-react";
import { getDaysRemaining } from "../../utils/getDaysRemaining";

const OrganizationDeletionDialog = ({
  organization,
  onDeletionUpdate = () => {},
  onRecoveryUpdate = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleRequestDeletion = async () => {
    if (confirmation !== organization.name) {
      return;
    }

    onDeletionUpdate();
    setOpen(false);
  };

  const handleRecover = async () => {
    setLoading(true);
    onRecoveryUpdate();
    setLoading(false);
    setOpen(false);
  };

  const daysRemaining = getDaysRemaining(organization?.scheduledDeletionAt);

  if (organization.isDeleted) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 hover:bg-green-700 hover:text-white text-white">
            <Undo2 className="h-4 w-4 mr-2" />
            Recover Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recover Organization</DialogTitle>
            <DialogDescription>
              Restore {organization.name} and cancel the deletion process.
            </DialogDescription>
          </DialogHeader>

          <Alert className="bg-amber-500/10 dark:border-amber-800 border-amber-200">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">
              Scheduled for Deletion
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              This organization is scheduled to be deleted in {daysRemaining}{" "}
              days.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleRecover}
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Undo2 className="h-4 w-4 mr-2" />
              )}
              Recover Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Organization</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The organization will be scheduled for
            deletion and permanently removed after 28 days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for deletion (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why are you deleting this organization?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <strong>{organization.name}</strong> to confirm
            </Label>
            <Input
              id="confirmation"
              placeholder={organization.name}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>

          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              All workspaces, projects, and data will be permanently deleted
              after 28 days. You can recover the organization anytime before
              then.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRequestDeletion}
            disabled={loading || confirmation !== organization.name}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Schedule Deletion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationDeletionDialog;
