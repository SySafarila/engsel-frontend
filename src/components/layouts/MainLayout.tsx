import { accessTokenAtom, isAuthAtom, userAtom } from "@/jotai/state";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useAtom(isAuthAtom);
  const [, setUser] = useAtom(userAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    if (isAuth === true) {
      return;
    }
    try {
      const getAccessToken = await axios.get("/api/get-access-token");
      const accessToken = getAccessToken.data.access_token;

      if (!accessToken) {
        throw new Error("access token not set");
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setIsAuth(true);
      setUser({
        email: res.data.user.email,
        name: res.data.user.name,
      });
      setAccessToken(accessToken);
    } catch {
      setIsAuth(false);
    }
  };

  return (
    <>
      <Navbar authenticated={isAuth} />
      <div className="max-w-screen-md mx-auto">{children}</div>
    </>
  );
};

export default MainLayout;
