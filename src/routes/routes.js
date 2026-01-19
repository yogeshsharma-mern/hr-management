import React from "react";

// Admin Imports
import MainDashboard from "../views/admin/default";
import NFTMarketplace from "../views/admin/marketplace";
import Profile from "../views/admin/profile";
import DataTables from "../views/admin/tables";
import RTLDefault from "../views/rtl/default";
import Example from "../views/admin/example/Example.jsx";
import Warehouse from "../views/admin/warehouse/Warehouse.js";
import ProductTable from "../views/admin/product/product";

// Auth Imports
import SignIn from "../views/auth/signin";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
  },
    {
    name: "Example Admin",
    layout: "/admin",
    path: "example",
    icon: <MdHome className="h-6 w-6" />,
    component: <Example />,
  },
        {
    name: "Product",
    layout: "/admin",
    path: "merchant/product",
    icon: <MdHome className="h-6 w-6" />,
    component: <ProductTable />,
  },
      {
    name: "Warehouse",
    layout: "/admin",
    path: "merchant/warehouse",
    icon: <MdHome className="h-6 w-6" />,
    component: <Warehouse />,
  },
];
export default routes;
