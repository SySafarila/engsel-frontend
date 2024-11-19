import { isAuthAtom, userAtom } from "@/utils/state";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useAtom(isAuthAtom);
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      });
    } catch {
      setIsAuth(false);
    }
  };

  return (
    <>
      <Navbar authenticated={true} />
      <div className="max-w-screen-md mx-auto">{children}</div>
    </>
  );
};

export default MainLayout;
