import React from "react";
import DeleteAlertDialog from "../admin/AlertDailog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { useDeleteProjectMutation } from "../../features/project/projectApi";
import { useNavigate } from "react-router-dom";
const ProjectDeleteCard = ({ projectId }) => {
  const navigate = useNavigate();
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();
  const handleDeleteProject = async () => {
    console.log(projectId);
    try {
      const res = await deleteProject(projectId).unwrap();
      console.log(res);
      toast.success(res?.message);
      navigate("/project");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
      console.error(error);
    }
  };
  return (
    <div>
      <Card className="border border-red-500">
        <CardHeader className="flex flex-col ">
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DeleteAlertDialog
            triggerText="Delete Project"
            title="Are you sure you want to delete this project?"
            description="This action cannot be undone. This will permanently delete this project."
            isLoading={isLoading}
            onConfirm={handleDeleteProject}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDeleteCard;
