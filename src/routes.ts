import AdvertisementPage from "./pages/AdvertisementPage";
import Advertisements from "./pages/Advertisements";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import { paths } from "./paths";

interface IComponent {
  path: string;
  Component: () => React.JSX.Element;
}

export const routes: IComponent[] = [
  {
    path: paths.Home,
    Component: Home,
  },
  {
    path: paths.Advertisements,
    Component: Advertisements,
  },
  {
    path: paths.AdvertisementPage + ":id",
    Component: AdvertisementPage,
  },
  {
    path: paths.Orders,
    Component: Orders,
  },
];
