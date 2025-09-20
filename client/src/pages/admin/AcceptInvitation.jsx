import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  Mail,
  User,
  Calendar,
} from "lucide-react";
import { dateFormater } from "../../utils/dateFormater";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAcceptInvitationMutation,
  useLazyGetInvitationByTokenQuery,
  useRejectInvitationMutation,
} from "../../features/invite/inviteApi";
import toast from "react-hot-toast";

// Helper functions
const getRoleBadgeVariant = (role) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "member":
      return "default";
    case "viewer":
      return "outline";
    case "manager":
      return "secondary";
    case "guest":
      return "accent";
    default:
      return "default";
  }
};

export default function AcceptInvitation() {
  const [processing, setProcessing] = useState(false);
  const [trigger, { isLoading, data, error }] =
    useLazyGetInvitationByTokenQuery();
  const navigate = useNavigate();

  const [acceptInvitation, { isLoading: isAccepting, error: acceptError }] =
    useAcceptInvitationMutation();

  const [rejectInvitation, { isLoading: isRejecting, error: rejectError }] =
    useRejectInvitationMutation();

  const params = useParams();
  const token = params.token;

  useEffect(() => {
    if (token) {
      trigger(token);
    }
  }, [token, trigger]);

  useEffect(() => {
    if (error) {
      toast.error(
        error?.data?.message || error?.error || "Something went wrong"
      );
    }
  }, [error]);

  if (acceptError) {
    toast.error(
      acceptError?.data?.message || acceptError?.error || "Something went wrong"
    );
  }

  const invitation = data?.invitation;

  const handleAcceptInvitation = async () => {
    try {
      const res = await acceptInvitation({ token }).unwrap();
      console.log(res);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      navigate(`/organization/${res?.data?.organization}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message ||
          error?.data?.message ||
          "Failed to accept organization"
      );
    }
  };

  const handleReject = async () => {
    try {
      const res = await rejectInvitation({ token }).unwrap();
      console.log(res);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message || error?.data?.message || "Failed to reject invitation"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center min-h-screen text-3xl font-semibold justify-center">
        <Loader2 className="animate-spin mr-3 w-12 h-12" />
        <p className="text-2xl bg-gradient text-transparent bg-clip-text font-medium">
          Loading....
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>
              There was a problem with your invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.data?.message || error?.error}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => navigate("/")}>
                Go Home
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Invitation Found</CardTitle>
            <CardDescription>
              There was a problem with your invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.data?.message || error?.error || "No invitation found"}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => navigate("/")}>
                Go Home
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-2 sm:p-4">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
        <CardHeader className="">
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You've been invited to join{" "}
            <strong>{invitation?.meta?.organization?.name} </strong>as{" "}
            <strong>{invitation?.role}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Organization Details */}
          <div className="flex gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={invitation?.meta?.organization?.logo}
                alt={invitation?.meta.organization?.name}
              />
              <AvatarFallback>
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <h3 className="font-semibold text-lg">
                {invitation?.meta?.organization.name}
              </h3>
              <div className="flex flex-wrap items-center sm:justify-center gap-2 text-sm text-muted-foreground">
                <Badge className="text-sm bg-orange-500">
                  <Mail className="h-4 w-4" />
                  {invitation?.email}
                </Badge>
                |{" "}
                <Badge
                  variant={getRoleBadgeVariant(invitation?.role)}
                  className="text-sm">
                  {invitation?.role.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Inviter Details */}
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Invited by</h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={invitation?.invitedBy?.avatar}
                  alt={invitation?.invitedBy?.name}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {invitation?.invitedBy?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invitation?.invitedBy?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Expiration */}
          {invitation?.expiresAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Expiry date: {dateFormater(invitation?.expiresAt)}</span>
            </div>
          )}

          {/* Custom Message */}
          {invitation?.message && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Message from inviter</h4>
              <p className="text-sm text-muted-foreground">
                {invitation?.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleAcceptInvitation}
              disabled={isAccepting}
              className="w-full bg-green-600"
              size="lg">
              {isAccepting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Accept Invitation
            </Button>

            <Button
              onClick={handleReject}
              disabled={processing}
              variant="outline"
              className="w-full"
              size="lg">
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Decline Invitation
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground mt-2">
            By accepting, you'll gain access to this organization's workspaces
            and resources.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
