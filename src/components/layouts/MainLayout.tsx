import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
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
      console.log(res);
      setIsAuth(true);
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
