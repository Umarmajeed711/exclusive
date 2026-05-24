import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Context";
import api from "./api";
import { showToast } from "./types";

export const VerifyEmailBanner = () => {
  const { state } = useContext(GlobalContext);

  const [sendingEmail, setSendingEmail] =
    useState(false);

  const handleResendVerification = async () => {
    if (sendingEmail) return;

    try {
      setSendingEmail(true);

      const response = await api.post(
        "/resend-verification-email",
        {
          email: state?.user?.email,
        }
      );

      showToast({
        icon: "success",
        title: response.data.message,
      });
    } catch (error) {
      showToast({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (state?.user?.email_verified) {
    return null;
  }

  return (
    <div
      className="
      w-full
      bg-yellow-50
      border border-yellow-200
      p-2 md:p-3
      flex flex-col md:flex-row
      md:items-center
      md:justify-between
      gap-4
      shadow-sm
    "
    >
      {/* Left Side */}
      <div className="flex gap-3">
        <div
          className="
          min-w-10 h-10
          rounded-full
          bg-yellow-100
          flex items-center justify-center
          text-yellow-700
          text-lg
        "
        >
          ⚠
        </div>

        <div>
          <h3 className="font-semibold text-yellow-900">
            Verify your email address
          </h3>

          {/* <p className="text-sm text-yellow-700 mt-1">
            Please verify your email to keep your
            account secure and access all features.
          </p> */}

          <p className="text-xs text-yellow-600 mt-1">
            Verification email sent to:
            <span className="font-medium ml-1">
              {state?.user?.email}
            </span>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <button
        onClick={handleResendVerification}
        disabled={sendingEmail}
        className="
        min-w-[170px]
        px-4 py-2.5
        rounded-xl
        bg-theme-primary
        text-white
        font-medium
        transition-all duration-200
        hover:opacity-90
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex justify-center items-center
      "
      >
        {sendingEmail ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>

            <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>

            <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
          </div>
        ) : (
          "Resend Email"
        )}
      </button>
    </div>
  );
};