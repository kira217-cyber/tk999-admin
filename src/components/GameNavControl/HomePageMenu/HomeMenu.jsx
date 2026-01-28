import React, { useState } from "react";
import { motion } from "framer-motion";

import home_menu_1 from "../../../assets/home_menu_1.png";
import home_menu_1_blue from "../../../assets/home_menu_1_blue.png";
import HomePageMenuOption from "./HomePageMenuOption.jsx";

export default function HomeMenu() {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { title: "Dashboard" },
    { title: "Analytics" },
    { title: "Reports" },
    { title: "Settings" },
    { title: "Users" },
    { title: "Projects" },
    { title: "Tasks" },
    { title: "Calendar" },
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="w-full">
      {/* Horizontal Scrollable Menu Bar */}
      <div
        className="
        relative w-full h-16 md:h-20 
        bg-gradient-to-r from-gray-900 via-emerald-950/70 to-gray-900
        border border-emerald-800/40 rounded-xl overflow-hidden
        shadow-lg shadow-black/40 backdrop-blur-sm
      "
      >
        <div
          className="
          absolute inset-0 
          bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5
          pointer-events-none
        "
        />

        <div
          className="
          h-full px-4 md:px-6
          flex items-center gap-2 md:gap-3
          overflow-x-auto overflow-y-hidden
          scrollbar-thin scrollbar-thumb-emerald-700/60 scrollbar-track-transparent
          scroll-smooth
        "
        >
          {menuItems.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.button
                key={index}
                onClick={() => handleItemClick(index)}
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  group relative flex flex-col items-center justify-center
                  min-w-[80px] md:min-w-[100px] h-12 md:h-14
                  px-3 md:px-4 py-2
                  rounded-lg
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-emerald-700/80 text-emerald-100 border border-emerald-400/40 shadow-md shadow-emerald-900/40"
                      : "bg-gray-800/40 text-gray-300 hover:bg-emerald-900/30 hover:text-emerald-300 border border-transparent"
                  }
                `}
              >
                {/* Glow effect on active/hover */}
                <div
                  className={`
                  absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500
                  bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent
                  pointer-events-none
                  ${isActive ? "opacity-30" : ""}
                `}
                />

                <img
                  src={isActive ? home_menu_1 : home_menu_1_blue}
                  alt={`${item.title} icon`}
                  className={`
                    w-6 h-6 md:w-7 md:h-7 object-contain transition-all duration-300
                    ${isActive ? "brightness-110 drop-shadow-md" : "opacity-80 group-hover:opacity-100"}
                  `}
                />

                <span
                  className={`
                  mt-1 text-xs md:text-sm font-semibold tracking-tight
                  whitespace-nowrap
                  ${isActive ? "text-emerald-100" : "text-gray-300 group-hover:text-emerald-200"}
                `}
                >
                  {item.title}
                </span>

                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeMenuIndicator"
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sub-options / content area */}
      <div className="mt-6 md:mt-8">
        <HomePageMenuOption />
      </div>
    </div>
  );
}
