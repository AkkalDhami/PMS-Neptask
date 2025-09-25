import React from "react";
import WorkspaceForm from "./WorkspaceForm";
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "../../features/workspace/workspaceApi";
import toast from "react-hot-toast";
import { useGetAllOrgsQuery } from "../../features/org/orgApi";

const WorkspaceAction = ({
  fromWorkspace = false,
  orgId = null,
  initialData = null,
  workspaceId = null,
}) => {
  const [createWorkspace] = useCreateWorkspaceMutation();
  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const { data: orgData } = useGetAllOrgsQuery();

  const submitHandler = async ({ data, isUpdate }) => {
    try {
      if (isUpdate) {
        const res = await updateWorkspace({
          workspaceId,
          data,
        }).unwrap();
        toast.success(res?.message);
        return;
      } else {
        const res = await createWorkspace({
          orgId: orgId || data.organization,
          data,
        }).unwrap();
        toast.success(res?.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.error || err?.data?.message || "Something went wrong");
    }
  };

  return (
    <WorkspaceForm
      fromWorkspace={fromWorkspace}
      organizations={orgData?.orgs}
      onSubmit={submitHandler}
      initialData={initialData}
    />
  );
};

export default WorkspaceAction;
