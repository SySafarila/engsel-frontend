import Link from "next/link";

const Navbar = ({ authenticated = false }: { authenticated: boolean }) => {
  return (
    <nav className="border-b">
      <div className="max-w-screen-md mx-auto px-5 py-3 flex items-center gap-3">
        <Link href="/">Home</Link>
        {authenticated === true && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/logout">Logout</Link>
          </>
        )}
        {authenticated === false && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
