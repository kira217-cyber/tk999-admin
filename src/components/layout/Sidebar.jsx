import React, { useContext, useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "../../AuthContext/AuthContext";
import { logout } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";

// React Icons
import {
  FaChartLine,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserFriends,
  FaWallet,
  FaGamepad,
  FaPlusCircle,
  FaListAlt,
  FaHistory,
  FaMoneyBillWave,
  FaCashRegister,
  FaTrophy,
  FaImage,
  FaCopyright,
  FaBullhorn,
  FaSlidersH,
  FaEnvelope,
  FaCog,
  FaDesktop,
  FaHeadset,
  FaSignOutAlt,
  FaLink,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoFootstepsSharp, IoSettings } from "react-icons/io5";
import { TfiLayoutSlider } from "react-icons/tfi";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscServerProcess } from "react-icons/vsc";
import { MdOutline6FtApart, MdLastPage } from "react-icons/md";
import { DiCssTricks } from "react-icons/di";
import {
  FaRegCalendarPlus,
  FaCreativeCommons,
  FaMoneyBillTransfer,
  FaVideo,
} from "react-icons/fa6";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdAdd, IoMdAddCircle } from "react-icons/io";
import AppRoutes from "../../routes/AppRoutes";

const CustomSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const nowDesktop = window.innerWidth >= 768;
      setIsDesktop(nowDesktop);
      if (nowDesktop) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onMenuSelect = (label) => {
    if (label === "Logout") {
      handleLogout();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/login");
  };

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaChartLine />,
      to: "/dashboard",
      end: true,
    },
    {
      label: "User",
      icon: <FaUsers />,
      submenu: [{ label: "All User", icon: <FaUserCheck />, to: "/all-user" }],
    },
    {
      label: "Affiliator",
      icon: <FaUserFriends />,
      submenu: [
        {
          label: "Super Affiliate",
          icon: <FaUserTimes />,
          to: "/super-affiliate",
        },
        {
          label: "Master Affiliate",
          icon: <FaUserTimes />,
          to: "/master-affiliate",
        },
        { label: "All Users", icon: <FaUserTimes />, to: "/all-users" },
      ],
    },
    {
      label: "Affiliator Site Setting",
      icon: <IoSettings />,
      submenu: [
        {
          label: "Navbar Setting",
          icon: <GiHamburgerMenu />,
          to: "/navbar-settings",
        },
        {
          label: "Slider Setting",
          icon: <TfiLayoutSlider />,
          to: "/slider-settings",
        },
        {
          label: "Why Choose Us Setting",
          icon: <FaRegCalendarPlus />,
          to: "/why-choose-us-settings",
        },
        {
          label: "How to Process Settings",
          icon: <VscServerProcess />,
          to: "/how-to-process-settings",
        },
        {
          label: "Commissions Settings",
          icon: <FaCreativeCommons />,
          to: "/commissions-settings",
        },
        {
          label: "Partner Settings",
          icon: <MdOutline6FtApart />,
          to: "/partner-settings",
        },
        {
          label: "Tricker Settings",
          icon: <DiCssTricks />,
          to: "/tricker-settings",
        },
        {
          label: "Last Part Settings",
          icon: <MdLastPage />,
          to: "/last-part-settings",
        },
        {
          label: "Footer Settings",
          icon: <IoFootstepsSharp />,
          to: "/footer-settings",
        },
        {
          label: "Fav Icon and Title Settings",
          icon: <FaImage />,
          to: "/fav-icon-and-title-settings",
        },
        {
          label: "Admin Fav Icon and Title Settings",
          icon: <FaImage />,
          to: "/admin-fav-icon-and-title-settings",
        },
        {
          label: "Super Affiliate Video Settings",
          icon: <FaVideo />,
          to: "/super-affiliate-video-settings",
        },
        {
          label: "Master Affiliate Video Settings",
          icon: <FaVideo />,
          to: "/master-affiliate-video-settings",
        },
      ],
    },
    {
      label: "Promotions",
      icon: <IoMdAddCircle />,
      submenu: [
        { label: "Add Promotion", icon: <IoMdAdd />, to: "/add-promotion" },
        { label: "Social Links", icon: <FaLink />, to: "/social-links" },
        {
          label: "Balance Transfer Control",
          icon: <FaMoneyBillTransfer />,
          to: "/balance-tranasfer-control",
        },
        {
          label: "Add Withdraw Method",
          icon: <FaMoneyBillTransfer />,
          to: "/add-withdraw-method",
        },
        {
          label: "Withdraw Request",
          icon: <FaMoneyBillTransfer />,
          to: "/withdraw-request",
        },
        {
          label: "Withdraw History",
          icon: <FaMoneyBillTransfer />,
          to: "/withdraw-history",
        },
      ],
    },
    {
      label: "Wallet Agent",
      icon: <FaWallet />,
      submenu: [
        {
          label: "All Active Wallet Agent",
          icon: <FaUserCheck />,
          to: "/all-active-wallet-agent",
        },
        {
          label: "Deactive Wallet Agent",
          icon: <FaUserTimes />,
          to: "/deactive-wallet-agent",
        },
      ],
    },
    {
      label: "Game",
      icon: <FaGamepad />,
      submenu: [
        {
          label: "Create Categories",
          icon: <FaPlusCircle />,
          to: "/game-nav-control",
        },
        {
          label: "Add Main Games",
          icon: <FaPlusCircle />,
          to: "/game-control",
        },
        { label: "Game History", icon: <FaHistory />, to: "/game-history" },
        { label: "Game Turnover", icon: <FaHistory />, to: "/game-turnover" },
        { label: "Tournament", icon: <FaTrophy />, to: "/tournament" },
        { label: "Jackpot", icon: <FaTrophy />, to: "/jackpot" },
      ],
    },
    // {
    //   label: "Risk Management",
    //   icon: <FaCog />,
    //   submenu: [
    //     {
    //       label: "Casino Risk Management",
    //       icon: <FaCog />,
    //       to: "/casino-risk-management",
    //     },
    //     {
    //       label: "Sports Risk Management",
    //       icon: <FaCog />,
    //       to: "/sports-risk-management",
    //     },
    //   ],
    // },
    // {
    //   label: "Game API Key",
    //   icon: <FaCog />,
    //   submenu: [
    //     { label: "Evolution API", icon: <FaCog />, to: "/evolution-api" },
    //     {
    //       label: "Exchange Betfair API",
    //       icon: <FaCog />,
    //       to: "/exchange-betfair-api",
    //     },
    //   ],
    // },
    {
      label: "Frontend Control",
      icon: <FaSlidersH />,
      submenu: [
        { label: "Slider", icon: <FaImage />, to: "/carousel-control" },
        {
          label: "Registration Page Banner",
          icon: <FaImage />,
          to: "/RegistrationPageBanner",
        },
        { label: "Notice Control", icon: <FaImage />, to: "/notice-control" },
        {
          label: "Animation Banner",
          icon: <FaImage />,
          to: "/AnimationBanner",
        },
        {
          label: "Favorites Poster",
          icon: <FaImage />,
          to: "/favorites-poster-control",
        },
        {
          label: "Featured Poster",
          icon: <FaImage />,
          to: "/featured-game-control",
        },
        { label: "Site Control", icon: <FaCopyright />, to: "/site-title" },
      ],
    },
    {
      label: "Opay Setting",
      icon: <FaCog />,
      submenu: [
        { label: "Opay Api", icon: <FaCog />, to: "/opay/api" },
        {
          label: "Device Monitoring",
          icon: <FaCog />,
          to: "/opay/device-monitoring",
        },
        { label: "Opay Deposit", icon: <FaCog />, to: "/opay/deposit" },
      ],
    },
    {
      label: "Deposit",
      icon: <FaMoneyBillWave />,
      submenu: [
        {
          label: "Add Deposit Method",
          icon: <FaPlusCircle />,
          to: "/Add-Deposit-Methods",
        },
        {
          label: "Add Deposit Bonus",
          icon: <FaListAlt />,
          to: "/deposit-bonus",
        },
        {
          label: "All Deposit Request",
          icon: <FaCog />,
          to: "/deposit-transaction/filter/pending",
        },
        {
          label: "Successful Deposit",
          icon: <FaUserCheck />,
          to: "/deposit-transaction/filter/success",
        },
        {
          label: "Reject Deposit",
          icon: <FaUserTimes />,
          to: "/deposit-transaction/filter/reject",
        },
      ],
    },
    {
      label: "Withdraw",
      icon: <FaCashRegister />,
      submenu: [
        {
          label: "Add Withdraw Method",
          icon: <FaPlusCircle />,
          to: "/Add-Withdraw-Methods",
        },
        {
          label: "All Withdraw Request",
          icon: <FaCog />,
          to: "/Withdraw-transaction/filter/pending",
        },
        {
          label: "Successful Withdraw",
          icon: <FaUserCheck />,
          to: "/Withdraw-transaction/filter/success",
        },
        {
          label: "Reject Withdraw",
          icon: <FaUserTimes />,
          to: "/Withdraw-transaction/filter/reject",
        },
      ],
    },
    // {
    //   label: "Pages",
    //   icon: <FaListAlt />,
    //   submenu: [
    //     { label: "About US", icon: <FaListAlt />, to: "/about-us" },
    //     { label: "Blogs", icon: <FaListAlt />, to: "/blogs" },
    //     { label: "Sponsor", icon: <FaUsers />, to: "/sponsor" },
    //     { label: "Promotions", icon: <FaBullhorn />, to: "/promotions" },
    //     { label: "Contact US", icon: <FaEnvelope />, to: "/contact-us" },
    //   ],
    // },
    {
      label: "Settings",
      icon: <FaCog />,
      submenu: [
        {
          label: "E-mail Settings",
          icon: <FaEnvelope />,
          to: "/email-settings",
        },
        {
          label: "Site Maintenance Mode",
          icon: <FaCog />,
          to: "/site-maintenance-mode",
        },
      ],
    },
    {
      label: "Oracle Technology",
      icon: <FaDesktop />,
      submenu: [
        {
          label: "Technical Support",
          icon: <FaHeadset />,
          to: "/technical-support",
        },
        { label: "API Support", icon: <FaHeadset />, to: "/api-support" },
        { label: "Live Chat", icon: <FaHeadset />, to: "/live-chat" },
      ],
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-green-950 via-emerald-950 to-black text-gray-100">
      {/* ─── Mobile Top Bar ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-900 px-4 py-3.5 flex items-center justify-between shadow-md">
        <button
          onClick={() => setOpen(true)}
          className="p-2.5 rounded-lg hover:bg-emerald-800/40 transition-colors cursor-pointer"
        >
          <RxHamburgerMenu className="text-2xl text-emerald-200" />
        </button>

        <div className="flex items-center gap-5">
          <button className="relative p-1.5 cursor-pointer">
            <FaBell className="text-xl text-emerald-200 hover:text-white transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-red-600/60"></span>
          </button>
          <FaUserCircle className="text-2xl text-emerald-200 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main flex row: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── Sidebar ─── */}
        <motion.aside
          initial={false}
          animate={{
            x: open || isDesktop ? 0 : "-100%",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="fixed md:static top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-green-950 via-emerald-950/90 to-black border-r border-emerald-800/40 shadow-2xl flex flex-col overflow-hidden"
        >
          <SidebarContent
            menuItems={menuItems}
            openMenus={openMenus}
            toggleSubMenu={toggleSubMenu}
            onClose={() => setOpen(false)}
            onLogout={handleLogout}
          />
        </motion.aside>

        {/* ─── Main Content Area ─── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Top Bar */}
          <div className="hidden md:flex items-center justify-between px-6 lg:px-10 py-[25px] border-b border-emerald-800/50 bg-gradient-to-r from-emerald-900/80 via-green-900/70 to-black/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 text-lg" />
                <input
                  type="text"
                  placeholder="Search games, users, analytics..."
                  className="w-full pl-12 pr-5 py-3 bg-black/50 border border-emerald-800/60 rounded-xl text-emerald-100 placeholder-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-text"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative p-2.5 hover:bg-emerald-900/40 rounded-xl transition-colors cursor-pointer">
                <FaBell className="text-xl text-emerald-200 hover:text-emerald-100 transition-colors" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-red-600/40"></span>
              </button>

              <NavLink
                to="/profile"
                className="p-1 hover:bg-emerald-900/40 rounded-full transition-colors cursor-pointer"
              >
                <FaUserCircle className="text-3xl text-emerald-200 hover:text-emerald-100 transition-colors" />
              </NavLink>
            </div>
          </div>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto [scrollbar-width:none]">
            <div className="h-full">
              <div className="mt-22 md:mt-8">
                <AppRoutes />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const SidebarContent = ({
  menuItems,
  openMenus,
  toggleSubMenu,
  onClose,
  onLogout,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header / Logo */}
      <div className="p-6 border-b border-emerald-800/50 bg-gradient-to-r from-emerald-900/40 to-green-900/30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/60">
            <span className="text-white font-black text-3xl tracking-wider">
              A
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Admin Panel
            </h2>
            <p className="text-sm text-emerald-200/80">Welcome, Admin</p>
          </div>
        </div>
      </div>

      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl hover:bg-emerald-900/40 text-emerald-300 hover:text-emerald-100 md:hidden transition-colors cursor-pointer"
        >
          <FaTimes size={24} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto [scrollbar-width:none]">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleSubMenu(item.label)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-emerald-100 hover:bg-emerald-950/60 hover:text-emerald-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl opacity-90">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {openMenus[item.label] ? (
                    <FaChevronUp size={18} />
                  ) : (
                    <FaChevronDown size={18} />
                  )}
                </button>

                <AnimatePresence>
                  {openMenus[item.label] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pl-14 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={subItem.to}
                            end={subItem.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-5 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer group ${
                                isActive
                                  ? "bg-emerald-800/50 text-emerald-50 font-medium shadow-sm shadow-emerald-950/40"
                                  : "text-emerald-200/90 hover:text-emerald-100 hover:bg-emerald-950/50"
                              }`
                            }
                          >
                            <span className="text-xl opacity-80 group-hover:scale-110 transition-transform">
                              {subItem.icon}
                            </span>
                            <span>{subItem.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3.5 rounded-xl mb-1.5 text-base font-medium transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-700/80 to-green-700/80 text-white shadow-md shadow-emerald-900/50"
                      : "text-emerald-100 hover:bg-emerald-950/60 hover:text-emerald-50"
                  }`
                }
              >
                <span className="text-2xl opacity-90 group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-emerald-800/50 mt-auto shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-5 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-red-900/50 border border-red-600/40 cursor-pointer"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default CustomSidebar;
