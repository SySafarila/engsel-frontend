import MainLayout from "@/components/layouts/MainLayout";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Login = () => {
  const [isSending, setIsSending] = useState<boolean>(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: { email?: string; password?: string }) => {
    if (isSending === true) {
      return;
    }
    setIsSending(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      console.log(res);
      setIsSending(false);
      await Swal.fire({
        icon: "success",
        title: "Sukses",
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
    <MainLayout>
      <form
        className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-bold text-2xl mb-2">Login Page</h1>
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
    </MainLayout>
  );
};

export default Login;
