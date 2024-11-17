import React from "react";
import Navbar from "../Navbar";

const GuestMainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar authenticated={false} />
      <div className="max-w-screen-md mx-auto">{children}</div>
    </>
  );
};

export default GuestMainLayout;
