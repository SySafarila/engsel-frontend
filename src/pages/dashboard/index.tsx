import MainLayout from "@/components/layouts/MainLayout";
import { isAuthAtom, userAtom } from "@/utils/state";
import { useAtomValue } from "jotai";

const Dashboard = () => {
  const isAuth = useAtomValue(isAuthAtom);
  const user = useAtomValue(userAtom);

  return (
    <MainLayout>
      <div className="p-5">
        <p>Dashboard</p>
        <p>Hello {isAuth ? user?.name : "guest"}</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
