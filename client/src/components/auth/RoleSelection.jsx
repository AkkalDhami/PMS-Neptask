import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useChangeRoleMutation } from "../../features/user/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddOrgModal from "../org/AddOrgModal";
import { useCreateOrgMutation } from "../../features/org/orgApi";
import { useDispatch } from "react-redux";
import { updateUserRole } from "../../features/auth/authSlice";

export default function RoleSelection({ setRoleSelection, userId }) {
  const dispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState("");
  const [changeRole, { isLoading }] = useChangeRoleMutation();

  const [createOrg] = useCreateOrgMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const handleContinue = async () => {
    if (!selectedRole) return;
    try {
      await changeRole({ userId, role: selectedRole }).unwrap();
      dispatch(updateUserRole({ role: selectedRole }));
    } catch (err) {
      toast.error(err?.error || err?.data?.message || "Failed to change role");
      console.log(err);
    }

    if (selectedRole === "owner") {
      setIsDialogOpen(true);
      return;
    } else {
      navigate("/waiting-invite");
    }

    setRoleSelection(true);
  };

  const handleCreateOrganization = async (data) => {
    try {
      const res = await createOrg(data).unwrap();
      toast.success(res?.message);
      setIsDialogOpen(false);
      navigate(`/organization/${res?.org?._id}`);
    } catch (error) {
      toast.error(
        error?.message ||
          error?.data?.message ||
          "Failed to create organization"
      );
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Choose Your Role
      </h1>
      <p className="text-muted-foreground mb-12 text-center max-w-md">
        Select how you want to join the workspace. Owners can create
        organizations, while members can join existing ones.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Owner Card */}
        <div
          onClick={() => setSelectedRole("owner")}
          className={`cursor-pointer border rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300
            ${
              selectedRole === "owner"
                ? "border-orange-500 bg-orange-500/10 text-orange-600 "
                : "border-gray-200 dark:border-gray-700"
            }`}>
          <h2 className="text-xl font-semibold mb-2">Owner</h2>
          <p className="mb-4">
            Create a new organization, manage members, and set roles.
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="radio"
              name="role"
              value="owner"
              checked={selectedRole === "owner"}
              onChange={() => setSelectedRole("owner")}
              className="accent-orange-500 w-10 h-8"
            />
            <span className="text-xl font-medium flex-1">
              I want to be an Owner
            </span>
          </div>
        </div>

        {/* Member Card */}
        <div
          onClick={() => setSelectedRole("member")}
          className={`cursor-pointer border rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300
            ${
              selectedRole === "member"
                ? "border-purple-500 bg-purple-500/10 text-purple-600"
                : "border-gray-200 dark:border-gray-700 "
            }`}>
          <h2 className="text-xl font-semibold mb-2">Member</h2>
          <p className=" mb-4">
            Join an existing organization and collaborate on projects.
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="radio"
              name="role"
              value="member"
              checked={selectedRole === "member"}
              onChange={() => setSelectedRole("member")}
              className="accent-purple-500 w-10 h-8"
            />
            <span className="text-xl font-medium flex-1">
              I want to be a Member
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole || isLoading}
        className={`mt-10 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300
          ${
            selectedRole === "owner"
              ? "bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}>
        {isLoading ? "Processing..." : "Continue"}
      </button>

      {isDialogOpen && (
        <AddOrgModal
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onsubmit={handleCreateOrganization}
        />
      )}
    </div>
  );
}
