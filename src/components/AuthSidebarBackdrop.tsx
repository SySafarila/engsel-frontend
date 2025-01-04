import menuToggle from "@/utils/authMenuToggle";

const AuthSidebarBackdrop = () => {
  return (
    <div
      className="bg-black/80 fixed top-0 left-0 w-full h-full z-[5] hidden md:hidden"
      onClick={menuToggle}
      id="sidebar-backdrop"
    ></div>
  );
};

export default AuthSidebarBackdrop;
