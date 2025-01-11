import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};
export const MenuItem = ({ setActive, active, item, children, sectionRef, onClick }) => {
  return (
    <div
      onMouseEnter={() => setActive(item)}
      className="relative cursor-pointer"
      onClick={onClick} // Trigger the scroll effect
    >
      <motion.div
        transition={{ duration: 0.3 }}
        className={`text-black dark:text-white hover:opacity-90 ${active === item ? "font-bold" : ""}`}
      >
        {item}
      </motion.div>
      {active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {children && (
            <div className="absolute top-[calc(100%_+_0.8rem)] left-1/2 transform -translate-x-1/2 pt-2">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-2">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};


export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative max-w-lg mx-auto rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-3 px-6 py-3"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({ title, description, to, src }) => {
  return (
    <Link to={to} className="flex space-x-2">
      <img
        src={src}
        width={100}
        height={50}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-md"
      />
      <div>
        <h4 className="text-lg font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[8rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};
