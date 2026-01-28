import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaTimes } from "react-icons/fa";

import GameNavBarManager from "../components/GameNavControl/GameNavBarManager";
import MenuOptionManager from "../components/GameNavControl/MenuOptionManager";
import SubOptionManager from "../components/GameNavControl/SubOptionManager";
import HomeMenu from "../components/GameNavControl/HomePageMenu/HomeMenu.jsx";

export default function GameNavControl() {
  const [activeTab, setActiveTab] = useState("navbar");
  const [isPreviewOpen, setIsPreviewOpen] = useState(true); // default open on desktop

  const renderContent = () => {
    switch (activeTab) {
      case "navbar":
        return <GameNavBarManager />;
      case "menu":
        return <MenuOptionManager />;
      case "sub":
        return <SubOptionManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black text-gray-100 px-4 py-6 md:px-6 md:py-8 font-sans">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-300 tracking-tight">
          Navigation Control Panel
        </h1>
        <p className="mt-2 text-emerald-200/70 text-sm md:text-base">
          Manage navbar, menus and sub-menus appearance
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Preview Toggle + Preview Section (only on desktop) */}
        <AnimatePresence>
          {window.innerWidth >= 768 && (
            <>
              <motion.button
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mx-auto mb-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg shadow-emerald-900/30 transition-all duration-300"
              >
                {isPreviewOpen ? (
                  <>
                    <FaTimes className="text-lg" />
                    Hide Live Preview
                  </>
                ) : (
                  <>
                    <FaEye className="text-lg" />
                    Show Live Preview
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {isPreviewOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="mb-10 overflow-hidden rounded-2xl border border-emerald-800/40 bg-gradient-to-b from-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-2xl"
                  >
                    <div className="p-5 md:p-7">
                      <h2 className="text-xl font-semibold text-emerald-300 mb-5 text-center">
                        Live Preview
                      </h2>

                      <div className="border border-emerald-900/50 rounded-xl overflow-hidden bg-gray-950/60">
                        <HomeMenu />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-emerald-900/40 pb-1 overflow-x-auto">
          {["navbar", "menu", "sub"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative px-6 py-3 mx-1 md:mx-2 font-medium text-sm md:text-base rounded-t-xl transition-all duration-300
                ${
                  activeTab === tab
                    ? "bg-gradient-to-t from-emerald-900/60 to-emerald-800/40 text-emerald-200 border-b-2 border-emerald-400 shadow-md"
                    : "text-gray-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                }
              `}
            >
              {tab === "navbar" && "Navbar"}
              {tab === "menu" && "Menus"}
              {tab === "sub" && "Sub Menus"}

              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-400 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-emerald-900/30 shadow-2xl overflow-hidden"
        >
          <div className="p-5 md:p-7">{renderContent()}</div>
        </motion.div>
      </div>
    </div>
  );
}
