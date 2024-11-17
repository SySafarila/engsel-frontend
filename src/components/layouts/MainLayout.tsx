import React from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-md mx-auto">{children}</div>
    </>
  );
};

export default MainLayout;
