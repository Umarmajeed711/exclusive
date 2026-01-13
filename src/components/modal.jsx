import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, children,className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed  inset-0  backdrop-blur-md flex justify-center items-center z-50 modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Body */}
          <motion.div
            className={`bg-theme-primary p-2 rounded-xl  shadow-xl h-[600px] overflow-hidden max-h-[90%] w-[90%] max-w-lg relative ${className || ""}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-5 text-xl font-bold text-theme-primary hover:scale-110 transition-all duration-200"
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
