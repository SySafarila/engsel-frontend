import MainLayout from "@/components/layouts/MainLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Account: NextPageWithLayout = () => {
  const user = useAtomValue(userAtom);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: unknown) => {
    const user2 = data as {
      name: string;
      email: string;
      password: string;
      username: string;
    };

    if (isSending == true) {
      return;
    }

    try {
      setIsSending(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          email: user2.email,
          name: user2.name,
          password: user2.password == "" ? null : user2.password,
          username: user2.username,
        },
        {
          withCredentials: true,
        }
      );
      await Swal.fire({
        icon: "success",
        title: "Sukses",
      });
      setIsSending(false);
      router.reload();
    } catch (error) {
      setIsSending(false);
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.response?.data.message,
        });
      }
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Pengaturan Akun</h1>
      {user && (
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="name">Full Name *Required</label>
            <input
              required
              type="text"
              className="border py-2 px-3"
              id="name"
              placeholder="Full Name"
              {...register("name", { required: true, value: user?.name })}
            />
          </div>
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="username">Username *Required</label>
            <input
              required
              type="text"
              className="border py-2 px-3"
              id="username"
              placeholder="Username"
              {...register("username", {
                required: true,
                value: user?.username,
              })}
            />
          </div>
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="email">Email *Required</label>
            <input
              required
              type="email"
              className="border py-2 px-3"
              id="email"
              placeholder="Email"
              {...register("email", { required: true, value: user?.email })}
            />
          </div>
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="border py-2 px-3"
              id="password"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <div>
            <button
              className="bg-green-500 hover:bg-green-600 px-3 py-2 text-white disabled:bg-gray-200 disabled:text-black"
              type="submit"
              disabled={isSending}
            >
              {isSending ? "Loading..." : "Kirim"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Account;

Account.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
