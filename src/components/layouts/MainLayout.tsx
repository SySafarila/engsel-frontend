import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-screen-md mx-auto">{children}</div>;
};

export default MainLayout;
