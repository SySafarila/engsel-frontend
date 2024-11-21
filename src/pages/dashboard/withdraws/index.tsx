import MainLayout from "@/components/layouts/MainLayout";
import { userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

type WithdrawType = {
  amount: number;
  is_pending: boolean;
  created_at: string;
  updated_at: string;
};

type WithdrawsType = WithdrawType[];

const Withdraws = () => {
  const user = useAtomValue(userAtom);
  const [currentWithdraws, setCurrentWithdraws] = useState<WithdrawsType>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/withdraws`,
        {
          withCredentials: true,
        }
      );

      const arr: WithdrawsType = [];
      res.data.withdraws.forEach((data: WithdrawType) => {
        arr.push({
          amount: Number(data.amount),
          created_at: data.created_at,
          updated_at: data.updated_at,
          is_pending: data.is_pending,
        });
      });
      setCurrentWithdraws(arr);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }
  };

  const requestWithdraw = async (data?: unknown) => {
    const values = data as { amount: number };
    if (isSending === true) {
      return;
    }
    setIsSending(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/withdraws`,
        {
          amount: values.amount,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setIsSending(false);
      getData();
    } catch (error) {
      setIsSending(false);
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data.message,
        });
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-5 grid grid-cols-1 gap-4">
        <h1 className="text-2xl">Penarikan</h1>
        <p>Saldo tersisa: {user?.balance}</p>
        <form onSubmit={handleSubmit(requestWithdraw)} className="flex gap-2">
          <input
            type="number"
            id="amount"
            className="border py-2 px-3 flex-grow"
            placeholder="Jumlah penarikan"
            {...register("amount", { required: true })}
          />
          <button
            className="bg-green-500 hover:bg-green-600 px-3 py-2 text-white disabled:bg-gray-200 disabled:text-black"
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Loading..." : "Kirim"}
          </button>
        </form>
        <div className="grid grid-cols-1 gap-4">
          {currentWithdraws.map((wd, index) => (
            <div key={index} className="bg-gray-100 p-3 border">
              <p>Jumlah: {wd.amount}</p>
              <p>Status: {wd.is_pending ? "Pending" : "Sukses"}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Withdraws;
