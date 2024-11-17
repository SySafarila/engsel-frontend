/* eslint-disable @next/next/no-img-element */
import MainLayout from "@/components/layouts/MainLayout";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
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
  is_paid: boolean;
};

const TransactionDetail = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [donation, setDonation] = useState<TransactionDetailResponse>();
  const router = useRouter();
  const socket = io("ws://localhost:3030/transactions", {
    autoConnect: false,
  });

  useEffect(() => {
    if (router.isReady) {
      getDetailTransaction();
    }
    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("join");
      socket.off("transaction-settlement");
      socket.off("disconnect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const socketIO = () => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", router.query.transactionId);
    });

    socket.on("join", () => {
      console.log("Connected to realtime notification");
    });

    socket.on("transaction-settlement", () => {
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Transaksi berhasil",
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from realtime notification");
    });
  };

  const getDetailTransaction = async () => {
    try {
      const res = (
        await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${router.query.transactionId}`
        )
      ).data as TransactionDetailResponse;

      if (new Date().getTime() >= res.expired_at) {
        throw new Error("Transaction expired");
      }

      setDonation(res);
      setIsLoaded(true);

      if (res.is_paid === true) {
        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Transaksi berhasil",
        });
      } else {
        socketIO();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.message,
          text: error.response?.data.message ?? "",
          allowEscapeKey: false,
          allowEnterKey: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      } else if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: error.message,
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

  const formatAmount = (): string => {
    if (donation) {
      return new Intl.NumberFormat().format(donation.amount);
    }
    return "";
  };

  return (
    <MainLayout>
      <div className={`p-5 ${!isLoaded && "hidden"}`}>
        {donation?.qris && (
          <>
            <img
              src={donation.qris}
              alt="QRIS"
              className="mx-auto w-full md:w-1/2"
            />
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
              <span className="font-bold">
                {donation.virtual_account.number}
              </span>
            </p>
          </>
        )}
        <p className="text-center font-bold">Nominal Rp {formatAmount()}</p>
        {donation?.is_paid == false && (
          <p className="text-center">Bayar sebelum: {formatDate()}</p>
        )}
        {donation?.is_paid == true && (
          <p className="text-center">Transaksi telah dibayar</p>
        )}
      </div>
    </MainLayout>
  );
};

export default TransactionDetail;
