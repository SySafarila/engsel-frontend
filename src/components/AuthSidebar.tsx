import { logout } from "@/utils/logout";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import ActiveLink from "./ActiveLink";

const AuthSidebar = () => {
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
    <div
      className="bg-white border-r fixed w-1/2 md:w-60 transform -translate-x-full md:translate-x-0 z-10"
      id="sidebar"
    >
      <div className="flex flex-col h-screen overflow-y-auto">
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard"
        >
          Dashboard
        </ActiveLink>
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard/donations"
        >
          Dukungan
        </ActiveLink>
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard/overlays"
        >
          Overlay
        </ActiveLink>
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard/withdraws?is_pending=true"
        >
          Cash-Out
        </ActiveLink>
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard/banks"
        >
          Bank
        </ActiveLink>
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard/donations/setting"
        >
          Pengaturan Donasi
        </ActiveLink>
        <ActiveLink
          className="p-3 hover:bg-gray-100"
          activeClassName="bg-gray-100"
          href="/dashboard/account"
        >
          Pengaturan Akun
        </ActiveLink>
        <button
          className="p-3 m-3 rounded bg-red-500 hover:bg-red-600 text-white"
          onClick={logoutNow}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AuthSidebar;
