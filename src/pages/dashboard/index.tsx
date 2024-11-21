import MainLayout from "@/components/layouts/MainLayout";
import { userAtom } from "@/utils/state";
import { useAtomValue } from "jotai";
import Link from "next/link";

const Dashboard = () => {
  const user = useAtomValue(userAtom);

  return (
    <MainLayout>
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
            href="/dashboard/overlay"
            className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
          >
            Overlay Untuk OBS & Streamlabs
          </Link>
          <Link
            href="/dashboard/withdraws"
            className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
          >
            Penarikan
          </Link>
          <Link
            href="/dashboard/account"
            className="bg-gray-100 border p-3 hover:bg-gray-200 text-center flex items-center justify-center"
          >
            Pengaturan Akun
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
