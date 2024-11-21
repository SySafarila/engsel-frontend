import { logout } from "@/utils/logout";
import { isAuthAtom, userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useAtom(isAuthAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

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

  return (
    <>
      <Navbar authenticated={true} />
      <div className="max-w-screen-md mx-auto">{children}</div>
      <p className="text-center mb-5">
        &copy; 2024{" "}
        <a
          href="https://github.com/sysafarila"
          className="text-blue-500 hover:underline"
        >
          SySafarila
        </a>
      </p>
    </>
  );
};

export default MainLayout;
