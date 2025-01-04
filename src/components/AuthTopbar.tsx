import menuToggle from "@/utils/authMenuToggle";
import Link from "next/link";

const AuthTopbar = () => {
  return (
    <div
      className="bg-white border-b p-5 flex justify-between fixed w-full top-0 md:hidden z-10"
      id="topbar"
    >
      <Link href="/dashboard">Engsel</Link>
      <button onClick={menuToggle}>
        <svg
          className="fill-white"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          // fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
        </svg>
      </button>
    </div>
  );
};

export default AuthTopbar;
