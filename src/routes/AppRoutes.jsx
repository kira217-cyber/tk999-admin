import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AllUser from "../pages/AllUser";
import UserDetails from "../pages/UserDetails";
import CarouselControl from "../pages/CarouselControl";
import NoticeControl from "../pages/NoticeControl";
import GameNavControl from "../pages/GameNavControl";
import GameControl from "../pages/GameControl";
import AddDepositMethods from "../pages/AddDepositMethods";
import DepositTransaction from "../pages/DepositTransaction";
import TransactionDetails from "../pages/TransactionDetails";
import AddWithdrawMethods from "./../pages/AddWithdrawMethods";
import WithdrawTransaction from "../pages/WithdrawTransaction";
import SingleWithdrawTransaction from "../pages/SingleWithdrawTransaction";
import FeaturedGame from "../pages/FeaturedGame";
import FavoritesPoster from "../pages/FavoritesPoster";
import SiteControl from "../pages/SiteControl";
import AnimationBanner from "../pages/AnimationBanner";
import RegistrationPageBanner from "../pages/RegistrationPageBanner";
import SuperAffiliate from "../pages/SuperAffiliate";
import MasterAffiliate from "../pages/MasterAffiliate";
import SliderSettings from "../pages/SliderSettings";
import NavbarSettings from "../pages/NavbarSettings";
import WhyChooseUsSettings from "../pages/WhyChooseUsSettings";
import HowToProcessSettings from "../pages/HowToProcessSettings";
import CommissionsSettings from "../pages/CommissionsSettings";
import PartnerSettings from "../pages/PartnerSettings";
import TrickerSettings from "../pages/TrickerSettings";
import LastPartSettings from "../pages/LastPartSettings";
import FooterSettings from "../pages/FooterSettings";
import FavIconAndTitleSettings from "../pages/FavIconAndTitleSettings";
import AdminFavIconAndTitleSettings from "../pages/AdminFavIconAndTitleSettings";
import SuperAffiliateVideoSettings from "../pages/SuperAffiliateVideoSettings";
import MasterAffiliateVideoSettings from "../pages/MasterAffiliateVideoSettings";
import PromotionController from "../pages/PromotionController";
import SocialLinksController from "../pages/SocialLinksController";
import AllUsers from "../pages/AllUsers";
import AddProvider from "../pages/AddProvider";
import AddGame from "../pages/AddGame";
import BalanceTransferController from "../pages/BalanceTransferController";
import AddWithdrawMethod from "../pages/AddWithdrawMethod";
import WithdrawRequest from "../pages/WithdrawRequest";
import WithdrawHistory from "../pages/WithdrawHistory";
import DepositBonus from "../pages/DepositBonus";
import OpaySetting from "../pages/OpaySetting";
import OpayApi from "../pages/OpayApi";
import OpayDeviceMonitoring from "../pages/OpayDeviceMonitoring";
import OpayDepositAdmin from "../pages/OpayDepositAdmin";
import GameHistory from "../pages/GameHistory";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/all-user" element={<AllUser />} />
    <Route path="/user/:userId" element={<UserDetails />} />
    <Route path="/carousel-control" element={<CarouselControl />} />
    <Route path="/notice-control" element={<NoticeControl />} />
    <Route path="/game-nav-control" element={<GameNavControl />} />
    <Route path="/game-control" element={<GameControl />} />
    <Route path="/deposit-bonus" element={<DepositBonus />} />
    <Route path="/Add-Deposit-Methods" element={<AddDepositMethods />} />
    <Route path="/deposit-transaction" element={<DepositTransaction />} />
    <Route
      path="/deposit-transaction/filter/:filter"
      element={<DepositTransaction />}
    />
    <Route path="/transaction/:id" element={<TransactionDetails />} />
    <Route path="/Add-Withdraw-Methods" element={<AddWithdrawMethods />} />
    <Route path="/Withdraw-transaction" element={<WithdrawTransaction />} />
    <Route
      path="/Withdraw-transaction/filter/:filter"
      element={<WithdrawTransaction />}
    />
    <Route
      path="/Withdraw-transaction/:id"
      element={<SingleWithdrawTransaction />}
    />
    <Route path="/favorites-poster-control" element={<FavoritesPoster />} />
    <Route path="/featured-game-control" element={<FeaturedGame />} />
    <Route path="/site-title" element={<SiteControl />} />
    <Route path="/AnimationBanner" element={<AnimationBanner />} />
    <Route
      path="/RegistrationPageBanner"
      element={<RegistrationPageBanner />}
    />
    <Route path="/super-affiliate" element={<SuperAffiliate />} />
    <Route path="/master-affiliate" element={<MasterAffiliate />} />
    <Route path="/all-users" element={<AllUsers />} />
    <Route path="/slider-settings" element={<SliderSettings />} />
    <Route path="/navbar-settings" element={<NavbarSettings />} />
    <Route path="/why-choose-us-settings" element={<WhyChooseUsSettings />} />
    <Route path="/how-to-process-settings" element={<HowToProcessSettings />} />
    <Route path="/commissions-settings" element={<CommissionsSettings />} />
    <Route path="/partner-settings" element={<PartnerSettings />} />
    <Route path="/tricker-settings" element={<TrickerSettings />} />
    <Route path="/last-part-settings" element={<LastPartSettings />} />
    <Route path="/footer-settings" element={<FooterSettings />} />
    <Route
      path="/fav-icon-and-title-settings"
      element={<FavIconAndTitleSettings />}
    />
    <Route
      path="/admin-fav-icon-and-title-settings"
      element={<AdminFavIconAndTitleSettings />}
    />
    <Route
      path="/super-affiliate-video-settings"
      element={<SuperAffiliateVideoSettings />}
    />
    <Route
      path="/master-affiliate-video-settings"
      element={<MasterAffiliateVideoSettings />}
    />
    <Route path="/add-promotion" element={<PromotionController />} />
    <Route path="/social-links" element={<SocialLinksController />} />
    <Route path="/add-provider" element={<AddProvider />} />
    <Route path="/add-game" element={<AddGame />} />
    <Route
      path="/balance-tranasfer-control"
      element={<BalanceTransferController />}
    />
    <Route path="/add-withdraw-method" element={<AddWithdrawMethod />} />
    <Route path="/withdraw-request" element={<WithdrawRequest />} />
    <Route path="/withdraw-history" element={<WithdrawHistory />} />
    <Route path="/opay-setting" element={<OpaySetting />} />
    <Route path="/opay/api" element={<OpayApi />} />
    <Route path="/opay/device-monitoring" element={<OpayDeviceMonitoring />} />
    <Route path="/opay/deposit" element={<OpayDepositAdmin />} />
    <Route path="/game-history" element={<GameHistory />} />
  </Routes>
);

export default AppRoutes;
