import { LoginForm } from "@/components/auth/login-form";
import { useLoginMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { setCredentials } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLoginUser = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      dispatch(
        setCredentials({
          user: res?.user,
          accessToken: res?.accessToken,
        })
      );
      navigate("/profile");
    } catch (err) {
      console.log(err);
      toast.error(err?.error || err?.data?.message);
    }
  };
  return (
    <div className="w-full mx-auto max-w-md">
      <LoginForm onsubmit={handleLoginUser} />
    </div>
  );
}
