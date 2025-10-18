import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import DevicePage from "./pages/DevicePage";
import Profile from "./pages/Profile";
import Registration from "./pages/Registration";
import Favourite from "./pages/Favourites";
import FindPet from "./pages/FindPet";
import Help from "./pages/Help";
import Partners from "./components/Partners";
import PetDetail from "./pages/PetDetail";
import Stories from "./pages/Stories";
import ProfilePage from "./pages/ProfilePage";
import AdsPage from "./pages/adsPage";
import EditAd from "./pages/EditAds";
import CreateAds from "./pages/createAds";
import OtherProfilePage from "./pages/OtherProfilePage";
import {
  ADMIN_ROUTE,
  DEVICE_ROUTE,
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
} from "./utils/consts";

// защищённые роуты (для авторизованных пользователей)
export const authRoutes = [
  { path: ADMIN_ROUTE, Component: Admin },
  { path: PROFILE_ROUTE, Component: ProfilePage },
  { path: FAVOURITES_ROUTE, Component: Favourite },
  { path: EDIT_ADS_ROUTE + "/:id", Component: EditAd },
  { path: CREATE_ADS_ROUTE, Component: CreateAds },
];

// публичные роуты (для всех пользователей)
export const publicRoutes = [
  { path: SHOP_ROUTE, Component: Shop },
  { path: LOGIN_ROUTE, Component: Auth },
  { path: REGISTRATION_ROUTE, Component: Registration },
  { path: DEVICE_ROUTE + "/:id", Component: DevicePage },
  { path: ADS_ROUTE + "/:id", Component: AdsPage },
  // 🔽 новые вкладки
  { path: FIND_PET_ROUTE, Component: FindPet },
  { path: STORIES_ROUTE, Component: Stories },
  { path: PARTNERS_ROUTE, Component: Partners },
  { path: HELP_ROUTE, Component: Help },
  { path: OTHER_PROFILE_PAGE_ROUTE + "/:id", Component: OtherProfilePage },
];
//petdetail
