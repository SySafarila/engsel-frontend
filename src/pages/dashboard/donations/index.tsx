import MainLayout from "@/components/layouts/MainLayout";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Donations = {
  amount: number;
  created_at: string;
  updated_at: string;
  donator_name: string;
  donator_email?: string;
  id: string;
  message: string;
};

const Donations = () => {
  const [donations, setDonations] = useState<Donations[]>([]);

  useEffect(() => {
    getDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDonations = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations`,
        {
          withCredentials: true,
        }
      );
      setDonations(res.data.donations);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: string): string => {
    const dateRaw = new Date(date);

    return `${dateRaw.getDate()}/${
      dateRaw.getMonth() + 1
    }/${dateRaw.getFullYear()} ${dateRaw.getHours()}:${dateRaw.getMinutes()}`;
  };

  const rupiahFormat = (amount: number): string => {
    return new Intl.NumberFormat().format(amount);
  };

  const replayDonation = async (transactionId: string) => {
    console.log(transactionId);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/replay`,
        {
          transaction_id: transactionId,
        },
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Sukses!",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: error.response?.data.message ?? "-",
        });
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-5">
        <p>Donations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-gray-100 p-3 border">
              <div className="flex justify-between gap-2">
                <p className="w-full break-all">
                  Dari: {donation.donator_name}
                </p>
                <small
                  className="cursor-pointer"
                  onClick={() => replayDonation(donation.id)}
                >
                  Replay
                </small>
              </div>
              <small>Email: {donation.donator_email ?? "-"}</small>
              <p>Rp {rupiahFormat(donation.amount)}</p>
              <p>&quot;{donation.message}&quot;</p>
              <small>{formatDate(donation.updated_at)}</small>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Donations;
