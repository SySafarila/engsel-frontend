import MainLayout from "@/components/layouts/MainLayout";
import { accessTokenAtom } from "@/utils/state";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

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
  const accessToken = useAtomValue(accessTokenAtom);

  useEffect(() => {
    if (accessToken) {
      getDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const getDonations = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/donations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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

  return (
    <MainLayout>
      <div className="p-5">
        <p>Donations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {donations.map((donation, index) => (
            <div key={index} className="bg-gray-100 p-3 border">
              <p>Dari: {donation.donator_name}</p>
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
