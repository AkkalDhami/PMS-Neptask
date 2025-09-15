import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Briefcase, Calendar, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dateFormater } from "../../utils/dateFormater";

const OrganizationCard = ({ organization }) => {
  const navigate = useNavigate();
  const getPlanColor = (plan) => {
    switch (plan) {
      case "free":
        return "bg-green-500/10 text-green-600";
      case "pro":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      onClick={() => navigate(`/organization/${organization._id}`)}
      className={`w-full border border-zinc-500/50 hover:border-orange-600 ${
        organization?.isDeleted
          ? "border-red-500 bg-red-500/10 hover:border-red-600"
          : ""
      } cursor-pointer max-w-[340px] hover:shadow-lg transition-shadow`}>
      <CardHeader className="flex flex-row items-start space-y-0 gap-4">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage
            src={organization.logo?.url}
            className={"object-cover"}
          />
          <AvatarFallback
            className={"rounded-lg bg-primary dark:text-black text-white"}>
            {organization?.name?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{organization.name}</h3>
            <Badge
              variant="outline"
              className={getPlanColor(organization.subscription.plan)}>
              {organization.subscription.plan}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {organization.orgEmail}
          </p>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{organization.members.length} members</span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>{organization.workspaces.length} workspaces</span>
          </div>
        </div>

        <div className="flex space-y-2 flex-col justify-between text-sm text-muted-foreground">
          <div className="flex items-center  text-foreground gap-2">
            <Crown className="h-4 w-4 text-foreground" />
            <span>Owned by {organization.owner?.name || "User"}</span>
          </div>
          <div className="flex items-center  text-foreground gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created on {dateFormater(organization.createdAt)}</span>
          </div>

          {organization.subscription.renewalDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Renews:{" "}
                {new Date(
                  organization.subscription.renewalDate
                ).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;
