import { SidebarApp } from "@/components/SidebarApp";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { logout } from "@/utils/logout";
import { isAuthAtom, userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function NewAuth({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useAtom(isAuthAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  const getCurrentUser = async () => {
    if (isAuth === true) {
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          withCredentials: true,
        }
      );

      setIsAuth(true);
      setUser({
        email: res.data.user.email,
        name: res.data.user.name,
        id: res.data.user.id,
        username: res.data.user.username,
        balance: res.data.user.balance,
      });
    } catch (error) {
      setIsAuth(false);
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          logout().then(() => {
            setTimeout(() => {
              router.reload();
            }, 1000);
          });
        }
      }
    }
  };

  useEffect(() => {
    console.log("Main Layout");

    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <SidebarApp />
      <main className="w-full">
        <div className="flex items-center pl-3 pt-3">
          <SidebarTrigger />
          <Breadcrumb className="ml-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
