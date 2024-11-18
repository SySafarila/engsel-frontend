import MainLayout from "@/components/layouts/MainLayout";
import { userAtom } from "@/utils/state";
import { useAtomValue } from "jotai";

const Dashboard = () => {
  const user = useAtomValue(userAtom);

  return (
    <MainLayout>
      <div className="p-5">
        <p>Dashboard</p>
        <p>Hello {user?.name ?? "..."}</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
