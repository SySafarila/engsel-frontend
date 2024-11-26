import MainLayout from "@/components/layouts/MainLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { Banks } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Account: NextPageWithLayout = () => {
  const [banks, setBanks] = useState<Banks>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getBanks();
  }, []);

  const storeBank = async (data: unknown) => {
    const { bank, number } = data as { bank: string; number: number };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banks`,
        {
          bank: bank,
          number: number,
        },
        {
          withCredentials: true,
        }
      );
      await getBanks();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
      }
    }
  };

  const getBanks = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banks`,
        {
          withCredentials: true,
        }
      );
      const data = res.data as { message: string; data: Banks };
      setBanks(data.data);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
      }
    }
  };

  const deleteBank = async (id: string) => {
    const confirmation = confirm("Delete?");
    if (!confirmation) {
      return;
    }
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banks/${id}`, {
        withCredentials: true,
      });
      await getBanks();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Pengaturan Bank</h1>
      <form onSubmit={handleSubmit(storeBank)} className="flex gap-2 items-end">
        <div className="grid grid-cols-1 gap-1 md:col-span-2 w-1/2 md:w-full">
          <label htmlFor="bank">Bank</label>
          <select
            id="bank"
            {...register("bank", { required: true })}
            className="border py-2 px-3 appearance-none"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Pilih Bank
            </option>
            <option value="bca">BCA</option>
            <option value="gopay">GoPay</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2 w-full">
          <label htmlFor="number">No.</label>
          <input
            required
            type="number"
            className="border py-2 px-3"
            id="number"
            placeholder="No."
            {...register("number", { required: true })}
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 px-3 h-[42px] text-white disabled:bg-gray-200 disabled:text-black"
        >
          Kirim
        </button>
      </form>
      {isLoading == false && banks.length == 0 && <p>Data tidak ditemukan</p>}
      {isLoading == false && (
        <div className="grid gap-3">
          {banks.map((bank, index) => (
            <div key={index} className="bg-gray-100 p-3 border">
              <div className="flex justify-between items-center">
                <p className="uppercase">{bank.bank}</p>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-600 text-sm"
                  onClick={() => deleteBank(bank.id)}
                >
                  Delete
                </button>
              </div>
              <p>No. {bank.number}</p>
              {bank.verified_at && (
                <p className="text-green-600">Terverifikasi</p>
              )}
              {!bank.verified_at && (
                <p className="text-yellow-600">Belum diverifikasi</p>
              )}
            </div>
          ))}
        </div>
      )}
      {isLoading == true && <p>Loading...</p>}
    </div>
  );
};

export default Account;

Account.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
