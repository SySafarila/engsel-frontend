import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/utils/logout";
import {
  Blend,
  CircleDollarSign,
  DollarSign,
  Home,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Dukungan",
    url: "/dashboard/donations",
    icon: CircleDollarSign,
  },
  {
    title: "Overlay",
    url: "/dashboard/overlays",
    icon: Blend,
  },
  {
    title: "Cash-Out",
    url: "/dashboard/withdraws?is_pending=true",
    icon: DollarSign,
  },
  {
    title: "Bank",
    url: "/dashboard/banks",
    icon: Wallet,
  },
  {
    title: "Pengaturan Donasi",
    url: "/dashboard/donations/setting",
    icon: Settings,
  },
  {
    title: "Pengaturan Akun",
    url: "/dashboard/account",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
    onclick: () => {
      logout();
    },
  },
];

export function SidebarApp() {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={router.pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
