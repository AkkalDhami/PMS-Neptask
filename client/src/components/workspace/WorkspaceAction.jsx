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
  const [createWorkspace, { error }] = useCreateWorkspaceMutation();
  const [updateWorkspace, { error: updateError }] =
    useUpdateWorkspaceMutation();
  const { data: orgData, error: orgError } = useGetAllOrgsQuery();
  if (error) {
    console.log(error);
    toast.error(error?.error || error?.data?.message || "Something went wrong");
  }

  const submitHandler = async ({ data, isUpdate }) => {
    console.log(data, isUpdate);
    let res;
    try {
      if (isUpdate) {
        res = await updateWorkspace({
          workspaceId,
          data,
        }).unwrap();
        console.log(res);
        return;
      } else {
        res = await createWorkspace({
          orgId: orgId || data.organization,
          data,
        }).unwrap();
      }
      console.log(res);
      toast.success(res?.message);
    } catch (err) {
      console.log(err);
      toast.error(err?.error || err?.data?.message || "Something went wrong");
    }
  };

  if (orgError) toast.error(orgError?.error || orgError?.data?.message);

  if (updateError)
    toast.error(updateError?.error || updateError?.data?.message);

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
