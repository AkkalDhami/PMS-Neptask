import React, { useState } from "react";
import OtpInput from "../../components/auth/input-otp";
import { ForgotPasswordForm } from "../../components/auth/forgot-password-form";
import toast from "react-hot-toast";
import {
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from "../../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { AuthEmailForm } from "../../components/auth/auth-email-form";
import { VerifyEmailSchema } from "../../schemas/auth";

const EmailVerify = () => {
  const [requestOtp, { error: otpError }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
  const [email, setEmail] = useState("");
  const [isGettingEmail, setIsGettingEmail] = useState(false);
  const navigate = useNavigate();
  const handleGetEmail = async (data) => {
    try {
      const res = await requestOtp({
        email: data?.email,
        purpose: "email-verify",
      }).unwrap();
      console.log(res);
      if (otpError) toast.error(otpError?.message);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      setIsGettingEmail(true);
      setEmail(data?.email);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.message || "Failed to request OTP"
      );
    }
  };

  const handleEmailVerification = async (data) => {
    try {
      const res = await verifyOtp({
        code: data,
        purpose: "email-verify",
        email,
      }).unwrap();
      if (error) toast.error(error.message);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      setIsGettingEmail(false);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message);
    }
  };

  return (
    <div className="w-full mx-auto max-w-md">
      {!isGettingEmail ? (
        <AuthEmailForm
          schema={VerifyEmailSchema}
          title="Email Verification"
          description="Enter your email and we'll send you an OTP."
          buttonText="Send OTP"
          linkText="Back to Profile?"
          linkUrl="/profile"
          linkLabel="Profile"
          onSubmit={handleGetEmail}
        />
      ) : (
        <>
          <OtpInput isLoading={isLoading} onsubmit={handleEmailVerification} />
        </>
      )}
    </div>
  );
};

export default EmailVerify;
