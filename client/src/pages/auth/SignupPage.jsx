import { SignupForm } from "@/components/auth/signup-form";
import { useRegisterMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import RoleSelection from "../../components/auth/RoleSelection";
import { useState } from "react";

export default function SignupPage() {
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();
  
  const [roleSelection, setRoleSelection] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleRegisterUser = async (data) => {
    console.log(data);
    try {
      const res = await register(data).unwrap();
      console.log(res);
      toast.success(res?.message);
      dispatch(
        setCredentials({
          user: res?.user,
          accessToken: res?.accessToken,
        })
      );
      setUserId(res?.user?._id);
      setRoleSelection(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.error || err?.data?.message);
    }
  };
  return (
    <>
      {roleSelection ? (
        <RoleSelection setRoleSelection={setRoleSelection} userId={userId} />
      ) : (
        <div className="w-full mx-auto max-w-md">
          <SignupForm onsubmit={handleRegisterUser} />
        </div>
      )}
    </>
  );
}
