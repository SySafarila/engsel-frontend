import NewAuth from "@/layouts/NewAuth";
import { NextPageWithLayout } from "@/pages/_app";
import axios, { AxiosError } from "axios";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Account: NextPageWithLayout = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    getMinTts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMinTts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/min-tts`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setValue("min-amount-for-tts", Number(res.data.data.value));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message ?? error.message);
      }
      setValue("min-amount-for-tts", 10000);
    }
  };

  const onSubmit = async (data: unknown) => {
    const data2 = data as {
      "min-amount-for-tts": string;
    };

    if (isSending == true) {
      return;
    }

    try {
      setIsSending(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/min-tts`,
        {
          amount: data2["min-amount-for-tts"],
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
      <h1 className="text-2xl">Pengaturan Donasi</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="min-amount-for-tts">
            Minimal Donasi Untuk Text-To-Speech (Rp)
          </label>
          <input
            required
            type="number"
            className="border py-2 px-3"
            id="min-amount-for-tts"
            placeholder="10000"
            {...register("min-amount-for-tts", { required: true })}
          />
        </div>
        <div>
          <button
            className="bg-green-500 hover:bg-green-600 px-3 py-2 text-white disabled:bg-gray-200 disabled:text-black"
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Account;

Account.getLayout = (page: ReactElement) => {
  return <NewAuth>{page}</NewAuth>;
};
