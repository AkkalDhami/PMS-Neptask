import React, { useState } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import CheckEmail from "../../components/auth/check-email";
import { useResetPasswordRequestMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { AuthEmailForm } from "../../components/auth/auth-email-form";
import { ForgotPasswordSchema } from "../../schemas/auth";

const ForgotPassword = () => {
  const [resetPasswordRequest] = useResetPasswordRequestMutation();

  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPasswordSubmit = async (val) => {
    try {
      setEmail(val.email);
      const res = await resetPasswordRequest(val).unwrap();
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.error || error?.data?.message);
    }

    setIsFormSubmit(true);
  };
  return (
    <div className="w-full mx-auto max-w-md">
      {isFormSubmit ? (
        <CheckEmail email={email} />
      ) : (
        <AuthEmailForm
          schema={ForgotPasswordSchema}
          title="Forgot Password?"
          description="Enter your email and we'll send you a password reset link."
          buttonText="Send Reset Link"
          linkText="Remember password?"
          linkUrl="/login"
          linkLabel="Login"
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
