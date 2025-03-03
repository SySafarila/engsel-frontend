import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { logout } from "@/utils/logout";
import {
  Blend,
  ChevronRight,
  CircleDollarSign,
  DollarSign,
  Home,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";

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
    title: "Pengaturan",
    icon: Settings,
    items: [
      {
        title: "Donasi",
        url: "/dashboard/donations/setting",
        icon: Settings,
      },
      {
        title: "Akun",
        url: "/dashboard/account",
        icon: Settings,
      },
    ],
  },
  {
    title: "Logout",
    icon: LogOut,
    onclick: (): void => {
      logout().finally(() => {
        window.location.reload();
      });
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
              {items.map((item) => {
                if (!item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={router.pathname === item.url}
                      >
                        {item.url ? (
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        ) : (
                          <div
                            className="cursor-pointer"
                            onClick={item.onclick ? item.onclick : () => {}}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                } else {
                  return (
                    <Collapsible
                      asChild
                      defaultOpen={false}
                      className="group/collapsible"
                      key={item.title}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip="asd">
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={router.pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
