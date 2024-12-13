import { userAtom } from "@/utils/state";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import AuthLayout from "@/layouts/Auth";

const Dashboard: NextPageWithLayout = () => {
  const user = useAtomValue(userAtom);

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Hello {user?.name ?? "..."}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          href="/dashboard/donations"
          className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
        >
          Donasi & Dukungan Masuk
        </Link>
        <Link
          href="/dashboard/overlays"
          className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
        >
          Overlay Untuk OBS & Streamlabs
        </Link>
        <Link
          href="/dashboard/withdraws?is_pending=true"
          className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
        >
          Penarikan / Cash Out
        </Link>
        <Link
          href="/dashboard/banks"
          className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
        >
          Bank
        </Link>
        <Link
          href="/dashboard/account"
          className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
        >
          Pengaturan Akun
        </Link>
        <Link
          href="/dashboard/donations/setting"
          className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
        >
          Pengaturan Donasi
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
