import React from "react";
import { motion } from "framer-motion";

import home_menu_option_1 from "../../../assets/home_menu_option_1.png";

export default function HomePageMenuOption() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // same as original

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mt-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="
            group relative
            bg-gradient-to-b from-gray-800/70 to-gray-900/70
            backdrop-blur-sm
            border border-emerald-800/30
            rounded-xl overflow-hidden
            shadow-lg shadow-black/30
            hover:shadow-emerald-900/30
            transition-all duration-300
            cursor-pointer
          "
        >
          {/* Subtle glow overlay on hover */}
          <div
            className="
            absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
            pointer-events-none
          "
          />

          <div className="p-4 md:p-5 flex flex-col items-center justify-center gap-3 min-h-[110px] md:min-h-[130px]">
            <div
              className="
              w-14 h-14 md:w-16 md:h-16 
              rounded-lg bg-emerald-900/30 
              flex items-center justify-center
              border border-emerald-700/40
              group-hover:border-emerald-500/60
              transition-colors duration-300
            "
            >
              <img
                src={home_menu_option_1}
                alt={`Menu option ${item}`}
                className="
                  w-9 h-9 md:w-10 md:h-10 object-contain
                  drop-shadow-md
                  group-hover:brightness-110
                  transition-all duration-300
                "
              />
            </div>

            <span
              className="
              text-sm md:text-base font-medium text-center
              text-gray-200 group-hover:text-emerald-200
              transition-colors duration-300
              tracking-tight
            "
            >
              Item {item}
            </span>
          </div>

          {/* Active/hover indicator line at bottom */}
          <div
            className="
            absolute bottom-0 left-0 right-0 h-0.5 
            bg-gradient-to-r from-transparent via-emerald-500 to-transparent
            opacity-0 group-hover:opacity-70
            transition-opacity duration-400
          "
          />
        </motion.div>
      ))}
    </div>
  );
}
