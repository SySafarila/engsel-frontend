import { logout } from "@/utils/logout";
import { isAuthAtom, userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Swal from "sweetalert2";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useAtom(isAuthAtom);
  const [, setUser] = useAtom(userAtom);

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
  const router = useRouter();

  const logoutNow = async () => {
    try {
      await logout();
      await Swal.fire({
        icon: "success",
        title: "Logout success",
      });
      router.reload();
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  };

  return (
    <>
      <div
        className="bg-white border-r fixed w-1/2 md:w-60 transform -translate-x-full md:translate-x-0"
        id="sidebar"
      >
        <div className="flex flex-col h-screen overflow-y-auto">
          <Link className="p-3 hover:bg-gray-100" href="/dashboard">
            Dashboard
          </Link>
          <Link className="p-3 hover:bg-gray-100" href="/dashboard/donations">
            Dukungan
          </Link>
          <Link className="p-3 hover:bg-gray-100" href="/dashboard/overlays">
            Overlay
          </Link>
          <Link
            className="p-3 hover:bg-gray-100"
            href="/dashboard/withdraws?is_pending=true"
          >
            Cash-Out
          </Link>
          <Link className="p-3 hover:bg-gray-100" href="/dashboard/banks">
            Bank
          </Link>
          <Link
            className="p-3 hover:bg-gray-100"
            href="/dashboard/donations/setting"
          >
            Pengaturan Donasi
          </Link>
          <Link className="p-3 hover:bg-gray-100" href="/dashboard/account">
            Pengaturan Akun
          </Link>
          <button
            className="p-3 m-3 rounded bg-red-500 hover:bg-red-600 text-white"
            onClick={logoutNow}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        className="bg-white border-b p-5 flex justify-between fixed w-full top-0 md:hidden"
        id="topbar"
      >
        <button>Logo</button>
        <button>Menu</button>
      </div>
      <main id="main" className="md:ml-60 mt-[65px] md:mt-0">
        {children}
      </main>
      <footer className="md:ml-60 p-5" id="footer">
        <p className="text-center">&copy; Engsel 2024</p>
      </footer>
    </>
  );
};

export default AuthLayout;
