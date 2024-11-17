import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const Navbar = ({ authenticated = false }: { authenticated: boolean }) => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      await Swal.fire({
        icon: "success",
        title: "Logout success",
      });
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  };
  return (
    <nav className="border-b">
      <div className="max-w-screen-md mx-auto px-5 py-3 flex items-center gap-3">
        <Link href="/">Home</Link>
        {authenticated === true && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <span onClick={logout} className="cursor-pointer">
              Logout
            </span>
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
