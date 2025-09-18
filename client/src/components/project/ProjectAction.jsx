import React from "react";
import ProjectFormDialog from "./ProjectFormDialog";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../features/project/projectApi";

import toast from "react-hot-toast";

const ProjectAction = ({ workspaceId, initialData }) => {
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const handleProjectSubmit = async (data) => {
    console.log(data);
    try {
      if (initialData) {
        const res = await updateProject({
          projectId: initialData._id,
          data,
        }).unwrap();
        console.log(res);
        toast.success(res?.message);
      } else {
        const res = await createProject({ data }).unwrap();
        console.log(res);
        toast.success(res?.message);
      }
    } catch (error) {
      toast.error(error?.message || error?.error || error?.data?.message);
    }
  };
  return (
    <ProjectFormDialog
      project={initialData}
      workspaceId={workspaceId}
      onSubmit={handleProjectSubmit}
    />
  );
};

export default ProjectAction;
