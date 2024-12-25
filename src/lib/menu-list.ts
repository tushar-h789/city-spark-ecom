import {
  Users,
  LayoutGrid,
  Package2,
  Network,
  ShoppingCart,
  Award,
  Blocks,
  PackagePlus,
  Settings,
  Bell,
  LifeBuoy,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Overview",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/admin" || pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/notifications",
          label: "Notifications",
          active: pathname.includes("/notifications"),
          icon: Bell,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Catalog Management",
      menus: [
        {
          href: "/inventory",
          label: "Inventory",
          active: pathname.includes("/inventory"),
          icon: PackagePlus,
          submenus: [],
        },
        {
          href: "/products",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Package2,
          submenus: [],
        },

        {
          href: "/templates",
          label: "Templates",
          active: pathname.includes("/templates"),
          icon: Blocks,
          submenus: [],
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Network,
          submenus: [],
        },
        {
          href: "/brands",
          label: "Brands",
          active: pathname.includes("/brands"),
          icon: Award,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Customer Operations",
      menus: [
        {
          href: "/orders",
          label: "Orders",
          active: pathname.includes("/orders"),
          icon: ShoppingCart,
          submenus: [],
        },
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/support-tickets",
          label: "Support Tickets",
          active: pathname.includes("/support-tickets"),
          icon: LifeBuoy,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "System Administration",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
