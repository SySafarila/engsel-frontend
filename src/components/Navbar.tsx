import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="max-w-screen-md mx-auto px-5 py-3 flex items-center gap-3">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
