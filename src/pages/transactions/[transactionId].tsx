/* eslint-disable @next/next/no-img-element */
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type TransactionDetailResponse = {
  amount: number;
  expired_at: number;
  message: string;
  transaction_id: string;
  qris?: string;
  virtual_account?: {
    bank: string;
    number: string;
  };
};

const TransactionDetail = () => {
  const [donation, setDonation] = useState<TransactionDetailResponse>();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getDetailTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const getDetailTransaction = async () => {
    try {
      const res = (
        await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${router.query.transactionId}`
        )
      ).data as TransactionDetailResponse;
      setDonation(res);
      console.log(res);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: error.message,
          text: error.response?.data.message ?? "",
          allowEscapeKey: false,
          allowEnterKey: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      }
    }
  };

  const formatDate = (): string => {
    if (donation) {
      const date = new Date(donation.expired_at);
      return `Tanggal ${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} pukul ${date.getHours()}:${date.getMinutes()}`;
    }
    return "";
  };

  return (
    <div className="p-5">
      {donation?.qris && (
        <>
          <img src={donation.qris} alt="QRIS" className="mx-auto" />
          <p className="text-center">
            Scan QRCODE di atas dengan E-Wallet atau Mobile Bank kalian yang
            mendukung QRIS
          </p>
        </>
      )}
      {donation?.virtual_account && (
        <>
          <p className="text-center">
            <span>Bank: </span>
            <span className="uppercase">{donation.virtual_account.bank}</span>
          </p>
          <p className="text-center">
            <span>Virtual Account: </span>
            <span className="font-bold">{donation.virtual_account.number}</span>
          </p>
        </>
      )}
      <p className="text-center">Bayar sebelum: {formatDate()}</p>
    </div>
  );
};

export default TransactionDetail;
