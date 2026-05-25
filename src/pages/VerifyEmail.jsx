import { useNavigate} from 'react-router-dom';
import api from '../components/helper/api';
import { useEffect, useState ,useRef, useContext } from 'react';
import Swal from 'sweetalert2';
import { GlobalContext } from '../context/Context';

// const VerifyEmail = () => {

//      const navigate = useNavigate();

//   useEffect(() => {
//     const query = new URLSearchParams(window.location.search);
//      const token = query.get("token");
    

//     const verify_email = async () => {
 
        

//         try {
//         let response =  await api.post(`/verify-email?token=${token}`);

//         Swal.fire(
//                     "Verified",
//                     "Email verified! You can now login your account.",
//                     "success"
//                   );

//        navigate("/login")
        

//     } catch (error) {
        

//         Swal.fire(
//                     "warning",
//                     "Email verification failed!",
//                     "warning"
//                   );
        
//     }
   
        
//     }
//     verify_email()

// },[navigate])

    

    
//   return (
//     <div className='main w-full flex justify-center items-center'>
//         <div className='text-2xl text-bold'>
//             Verifying your email...
//         </div>
//     </div>
//   )
// }

const VerifyEmail = () => {
  const navigate = useNavigate();

  const {state} = useContext(GlobalContext);

  const email = state?.user?.email;

  const [status, setStatus] = useState("verifying"); 
  // verifying | success | error

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const hasRun = useRef(false);

  const token = new URLSearchParams(window.location.search).get("token");

  // =========================
  // VERIFY EMAIL
  // =========================
  const verifyEmail = async () => {
    try {
      setStatus("verifying");

      // await api.post(`/verify-email?token=${token}`);

      setStatus("success");

      Swal.fire({
        icon: "success",
        title: "Email Verified 🎉",
        text: "Your account is ready. Redirecting to login...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus("error");

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          error?.response?.data?.message ||
          "Link expired or invalid",
      });
    }
  };

  // =========================
  // RESEND EMAIL
  // =========================
  const resendEmail = async () => {
    try {
      setResending(true);

      await api.post("/resend-verification-email", {
        email: email,
      });

      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: "New verification email sent successfully",
      });

      setCooldown(60); // 60 sec cooldown
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          "Unable to resend email",
      });
    } finally {
      setResending(false);
    }
  };

  // =========================
  // AUTO VERIFY ON LOAD
  // =========================
  useEffect(() => {
    if (!token || hasRun.current) return;

    hasRun.current = true;
    verifyEmail();
  }, [token]);

  // =========================
  // COOLDOWN TIMER
  // =========================
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  // =========================
  // UI
  // =========================
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">

      {/* ================= VERIFYING ================= */}
      {status === "verifying" && (
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-theme-primary rounded-full animate-spin mx-auto"></div>

          <h2 className="text-xl font-semibold mt-4">
            Verifying your email...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait, we are confirming your account
          </p>
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {status === "success" && (
        <div className="text-center">
          <div className="text-green-600 text-2xl font-bold">
            ✔ Email Verified Successfully
          </div>

          <p className="text-gray-500 mt-2">
            Redirecting you to login...
          </p>
        </div>
      )}

      {/* ================= ERROR ================= */}
      {status === "error" && (
        <div className="text-center max-w-md px-4">
          
          <div className="text-red-600 text-2xl font-bold">
            ✖ Verification Failed
          </div>

          <p className="text-gray-500 mt-2">
            Your link may be expired or invalid.
          </p>

          <div className="flex flex-col gap-3 mt-6">

            {/* Retry verify */}
            <button
              onClick={verifyEmail}
              className="bg-theme-primary text-white px-5 py-2 rounded-md hover:opacity-90"
            >
              Try Again
            </button>

            {/* Resend email */}
            <button
              onClick={resendEmail}
              disabled={resending || cooldown > 0}
              className="bg-gray-800 text-white px-5 py-2 rounded-md disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend Email"}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 underline text-sm"
            >
              Back to Login
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;