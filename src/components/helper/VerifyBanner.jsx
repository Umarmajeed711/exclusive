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
  

  if (state?.user?.email_verified || !state?.user?.user_id) {
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



export const VerifyEmailModal = ({
  isOpen,
  onClose,
  onVerified,
}) => {
  const { state } = useContext(GlobalContext);
  const [sendingEmail, setSendingEmail] = useState(false);

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
      onClose()
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => {e.stopPropagation()}}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="min-w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 text-2xl">
              ⚠
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Verify your email
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                You need to verify your email before
                continuing to checkout.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              A verification email has been sent to:
            </p>

            <p className="mt-1 font-semibold text-yellow-900 break-all">
              {state?.user?.email}
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Please verify your email address to place your order.
            If you didn’t receive the email, you can resend it.
          </p>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResendVerification}
            disabled={sendingEmail}
            className="
              flex-1
              px-4 py-3
              rounded-xl
              bg-theme-primary
              text-white
              font-medium
              hover:opacity-90
              transition
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

          <button
            onClick={onVerified}
            className="
              flex-1
              px-4 py-3
              rounded-xl
              border border-gray-300
              text-gray-700
              font-medium
              hover:bg-gray-50
              transition
            "
          >
            I’ve Verified My Email
          </button>
        </div>
      </div>
    </div>
  );
};