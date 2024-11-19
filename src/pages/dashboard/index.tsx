import MainLayout from "@/components/layouts/MainLayout";
import { userAtom } from "@/utils/state";
import { useAtomValue } from "jotai";
import Link from "next/link";

const Dashboard = () => {
  const user = useAtomValue(userAtom);

  return (
    <MainLayout>
      <div className="p-5">
        <p>Dashboard</p>
        <p>Hello {user?.name ?? "..."}</p>
        <p>
          <span>Menu: </span>
          <Link
            href="/dashboard/account"
            className="text-blue-500 hover:underline"
          >
            Pengaturan Akun
          </Link>
        </p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
