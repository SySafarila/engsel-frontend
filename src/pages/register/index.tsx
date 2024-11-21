import GuestMainLayout from "@/components/layouts/GuestMainLayout";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { NextPageWithLayout } from "../_app";

const Register: NextPageWithLayout = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const router = useRouter();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: {
    email?: string;
    password?: string;
    name?: string;
    username?: string;
  }) => {
    if (isSending === true) {
      return;
    }

    setIsSending(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
      });

      setIsSending(false);

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Silahkan login",
      }).then(() => {
        router.push("/login");
      });
    } catch (error) {
      setIsSending(false);

      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          text: error.response?.data.message,
        });
      }
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Register Page</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="border py-2 px-3"
            id="name"
            placeholder="Name"
            {...register("name", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="username">Username</label>
          <input
            required
            type="text"
            className="border py-2 px-3"
            id="username"
            placeholder="username"
            {...register("username", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            className="border py-2 px-3"
            id="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            className="border py-2 px-3"
            id="password"
            placeholder="Password"
            {...register("password", { required: true })}
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
    </div>
  );
};

export default Register;

Register.getLayout = (page: ReactElement) => {
  return <GuestMainLayout>{page}</GuestMainLayout>;
};
