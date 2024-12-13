import AuthLayout from "@/layouts/Auth";
import { NextPageWithLayout } from "@/pages/_app";
import formatDate from "@/utils/formatDate";
import { userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

type WithdrawType = {
  id: string;
  amount: number;
  is_pending: boolean;
  created_at: string;
  updated_at: string;
};

type WithdrawsType = WithdrawType[];

const Withdraws: NextPageWithLayout = () => {
  const [user, setUser] = useAtom(userAtom);
  const [currentWithdraws, setCurrentWithdraws] = useState<WithdrawsType>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/withdraws`,
        {
          withCredentials: true,
          params: {
            is_pending: router.query.is_pending,
            cursor: router.query.cursor,
          },
        }
      );

      const arr: WithdrawsType = [];
      res.data.withdraws.forEach((data: WithdrawType) => {
        arr.push({
          amount: Number(data.amount),
          created_at: data.created_at,
          updated_at: data.updated_at,
          is_pending: data.is_pending,
          id: data.id,
        });
      });

      if (router.query.cursor) {
        setCurrentWithdraws((current) => current.concat(arr));
      } else {
        setCurrentWithdraws(arr);
      }
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/withdraws`,
        {
          amount: values.amount,
        },
        {
          withCredentials: true,
        }
      );

      setValue("amount", null);

      setIsSending(false);
      getData();
      fetchCurrentBalance();
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

  const fetchCurrentBalance = async () => {
    const me = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        withCredentials: true,
      }
    );
    setUser({
      email: me.data.user.email,
      name: me.data.user.name,
      id: me.data.user.id,
      username: me.data.user.username,
      balance: me.data.user.balance,
    });
  };

  return (
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
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/dashboard/withdraws?is_pending=true`}
          className={`bg-gray-100 py-2 text-center border hover:bg-gray-200 ${
            router.query.is_pending == "true" && "bg-gray-200"
          }`}
        >
          Pending
        </Link>
        <Link
          href={`/dashboard/withdraws?is_pending=false`}
          className={`bg-gray-100 py-2 text-center border hover:bg-gray-200 ${
            router.query.is_pending == "false" && "bg-gray-200"
          }`}
        >
          Sukses
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentWithdraws.map((wd, index) => (
          <div key={index} className="bg-gray-100 p-3 border">
            <p>Jumlah: {wd.amount}</p>
            <p>
              Status:{" "}
              {wd.is_pending ? (
                "Pending"
              ) : (
                <span>
                  Sukses{" "}
                  <a
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/withdraws/${wd.id}/image`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Lihat Gambar
                  </a>
                </span>
              )}
            </p>
            <small>{formatDate(wd.created_at)}</small>
          </div>
        ))}
        {currentWithdraws.length == 0 && <p>Data tidak ditemukan</p>}
        {currentWithdraws.length > 0 && (
          <Link
            href={`/dashboard/withdraws?cursor=${
              currentWithdraws[currentWithdraws.length - 1].id
            }&is_pending=${router.query.is_pending ?? ""}`}
            scroll={false}
            className="bg-gray-100 md:col-span-2 text-center py-2 border hover:bg-gray-200"
          >
            More
          </Link>
        )}
      </div>
    </div>
  );
};

export default Withdraws;

Withdraws.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
