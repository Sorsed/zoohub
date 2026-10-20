import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Favourite from "./pages/Favourites";
import FindPet from "./pages/FindPet";
import Help from "./pages/Help";
import Partners from "./components/Partners";
import Stories from "./pages/Stories";
import ProfilePage from "./pages/ProfilePage";
import AdsPage from "./pages/adsPage";
import EditAd from "./pages/EditAds";
import CreateAds from "./pages/createAds";
import OtherProfilePage from "./pages/OtherProfilePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import {
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  FAVOURITES_ROUTE,
  FIND_PET_ROUTE,
  STORIES_ROUTE,
  PARTNERS_ROUTE,
  HELP_ROUTE,
  ADS_ROUTE,
  EDIT_ADS_ROUTE,
  CREATE_ADS_ROUTE,
  OTHER_PROFILE_PAGE_ROUTE,
  PRIVACY_ROUTE,
  TERMS_ROUTE,
  QUIZ_ROUTE,
  ADMIN_ROUTE,
  MODERATION_ROUTE,
} from "./utils/consts";

// защищённые роуты (для авторизованных пользователей)
export const authRoutes = [
  { path: PROFILE_ROUTE, Component: ProfilePage },
  { path: FAVOURITES_ROUTE, Component: Favourite },
  { path: EDIT_ADS_ROUTE + "/:id", Component: EditAd },
  { path: CREATE_ADS_ROUTE, Component: CreateAds },
  { path: MODERATION_ROUTE, Component: Admin },
  { path: ADMIN_ROUTE, Component: Admin },
];

// публичные роуты (для всех пользователей)
export const publicRoutes = [
  { path: SHOP_ROUTE, Component: Shop },
  { path: LOGIN_ROUTE, Component: Auth },
  { path: REGISTRATION_ROUTE, Component: Auth },
  { path: ADS_ROUTE + "/:id", Component: AdsPage },
  // 🔽 новые вкладки
  { path: FIND_PET_ROUTE, Component: FindPet },
  { path: QUIZ_ROUTE, Component: Quiz },
  { path: STORIES_ROUTE, Component: Stories },
  { path: PARTNERS_ROUTE, Component: Partners },
  { path: HELP_ROUTE, Component: Help },
  { path: OTHER_PROFILE_PAGE_ROUTE + "/:id", Component: OtherProfilePage },
  { path: PRIVACY_ROUTE, Component: PrivacyPolicy },
  { path: TERMS_ROUTE, Component: Terms },
];
