import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Covarage from "../pages/Covarage/Covarage";
import PrivateRoutes from "../routers/PrivateRoutes";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashbordLayout from "../layout/DashbordLayout";
import MyParcels from "../pages/Dashbord/MyParcels/MyParcels";
import Payment from "../pages/Dashbord/Payment/Payment";
import PaymentHistory from "../pages/Dashbord/PaymentHistory/PaymentHistory";
import BeaRaider from "../pages/Dashbord/BeaRaider/BeaRaider";
import pendingRiders from "../pages/Dashbord/PendingRider/pendingRiders";
import ActiveRider from "../pages/Dashbord/ActiveRiders/ActiveRider";

import MakeAdmin from "../pages/Dashbord/MakeAdmin/MakeAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },

      {
        path: "covarage",
        Component: Covarage,
        loader: () => fetch("../../public/serviceCenter.json.json"),
      },

      {
        path: "beaRaider",
        element: (
          <PrivateRoutes>
            {" "}
            <BeaRaider></BeaRaider>{" "}
          </PrivateRoutes>
        ),
        loader: () => fetch("../../public/serviceCenter.json.json"),
      },

      {
        path: "sendParcel",
        element: (
          <PrivateRoutes>
            <SendParcel></SendParcel>
          </PrivateRoutes>
        ),

        loader: () => fetch("../../public/serviceCenter.json.json"),
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },

  {
    path: "/dashbord",
    element: (
      <PrivateRoutes>
        <DashbordLayout></DashbordLayout>
      </PrivateRoutes>
    ),

    children: [
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "PaymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "pendingRiders",
        Component: pendingRiders,
      },
      {
        path: "ActiveRider",
        Component: ActiveRider,
      },
      {
        path: "MakeAdmin",
        Component: MakeAdmin,
      },
    ],
  },
]);
