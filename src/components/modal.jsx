import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// const Modal = ({ isOpen, onClose, children,className }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className={`fixed  inset-0  backdrop-blur-md flex justify-center items-center z-50 modal`}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           {/* Modal Body */}
//           <motion.div
//             className={`bg-theme-primary p-2 rounded-xl  shadow-xl h-[600px] overflow-hidden max-h-[90%] w-[90%] max-w-lg relative ${className || ""}`}
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//           >
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-5 text-xl font-bold text-theme-primary hover:scale-110 transition-all duration-200"
//             >
//               ×
//             </button>

//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;



const Modal = ({ isOpen, onClose, children, className }) => {
  const modalRef = useRef(null);

  // 🔒 Lock body scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ⌨️ Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/30 backdrop-blur-md modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Backdrop click
        >
          {/* Modal Panel */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            className={`relative w-[90%] max-w-lg h-[700px] max-h-[80vh] overflow-hidden rounded-xl bg-theme-primary p-4 shadow-xl ${className || ""}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop close
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute p-2 right-4 top-3 text-xl font-bold text-theme-primary transition hover:scale-110"
            >
              ×
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;