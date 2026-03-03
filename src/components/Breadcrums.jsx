// import React from "react";
// import { PiGreaterThan } from "react-icons/pi";
// import { Link } from "react-router-dom";

// const Breadcrums = ({ currentPage, prevPages = [] }) => {
//   return (
//     <nav aria-label="Breadcrumb">
//     <div className="container    mt-5 flex gap-2 items-center">
//       <Link to="/" className="text-base capitalize  sm:text-[18px] font-normal text-gray-500">
//         Home
//       </Link>{" "}
//       {prevPages?.map((prev, i) => {
//         return (
//          <React.Fragment key={i}>
//             <PiGreaterThan className="text-gray-400 text-sm"/>
//             <Link
//               to={prev?.url}
//               className="text-sm sm:text-base capitalize  font-normal text-gray-500"
             
//             >
//               {prev?.name}
//             </Link>
//          </React.Fragment>
//         );
//       })}
//       {prevPages?.length > 0 && (
//   <PiGreaterThan className="text-gray-400 text-sm" />
// )}
//       <span className="text-sm capitalize  sm:text-base font-normal">{currentPage}</span>
//     </div>
//     </nav>
//   );
// };

// export default Breadcrums;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PiGreaterThan } from "react-icons/pi";
import React from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
};

const Breadcrumbs = ({ currentPage, prevPages = [] }) => {
  return (
    <nav aria-label="Breadcrumb">
      <motion.div
        className="container mt-5 flex gap-2 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="text-base capitalize sm:text-[18px] font-normal text-gray-500
                       hover:text-gray-700 transition-colors"
          >
            Home
          </Link>
        </motion.div>

        {prevPages?.map((prev, i) => (
          <React.Fragment key={i}>
            <motion.div variants={itemVariants}>
              <PiGreaterThan className="text-gray-400 text-sm" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                to={prev?.url}
                className="text-sm sm:text-base capitalize font-normal text-gray-500
                           hover:text-gray-700 transition-colors"
              >
                {prev?.name}
              </Link>
            </motion.div>
          </React.Fragment>
        ))}

        
          <motion.div variants={itemVariants}>
            <PiGreaterThan className="text-gray-400 text-sm" />
          </motion.div>
       

        <motion.span
          variants={itemVariants}
          className="text-sm sm:text-base capitalize font-normal text-gray-800"
        >
          {currentPage}
        </motion.span>
      </motion.div>
    </nav>
  );
};

export default Breadcrumbs;
