import GuestMainLayout from "@/components/layouts/GuestMainLayout";
import Link from "next/link";

export default function Home() {
  return (
    <GuestMainLayout>
      <div className="p-5">
        <p>Selamat datang di Engsel, blablablablablabla</p>
        <div className="flex justify-center gap-2 mt-3">
          <Link
            href="/login"
            className="bg-white border px-3 py-1 hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white border px-3 py-1 hover:bg-gray-100"
          >
            Register
          </Link>
        </div>
      </div>
    </GuestMainLayout>
  );
}
