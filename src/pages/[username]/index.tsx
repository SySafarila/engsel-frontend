import GuestMainLayout from "@/components/layouts/GuestMainLayout";
import axios, { AxiosError } from "axios";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

type User = {
  id: string;
  name: string;
  username: string;
};

type Users = {
  message: string;
  user: User[];
};

type Donation = {
  amount: number;
  donator: {
    name: string;
  };
  message: string;
  currency: string;
};

type SendRequest = {
  amount?: string;
  donator_email?: string;
  donator_name?: string;
  message?: string;
  payment_method?: string;
};

type RequiredRequest = {
  donator_name: string;
  donator_email?: string;
  message: string;
  payment_method: string;
  amount: number;
};

export default function User({ user }: { user: User }) {
  const { register, handleSubmit } = useForm();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [latestDonation, setLatestDonation] = useState<Donation | null>(null);
  const router = useRouter();
  const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/donations`, {
    autoConnect: false,
  });

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", user.id);
    });

    socket.on("donation", (donation) => {
      console.log(donation);
      setLatestDonation(donation);
    });

    return () => {
      socket.disconnect();
      socket.off("donation");
      socket.off("connect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const sendRequest = async (data: SendRequest) => {
    if (isSending === true) {
      return;
    }

    setIsSending(true);

    const requestBody: RequiredRequest = {
      amount: parseInt(data.amount!),
      donator_name: data.donator_name!,
      donator_email: data.donator_email!,
      message: data.message!,
      payment_method: data.payment_method!,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.username}/donate`,
        requestBody
      );

      setIsSending(false);

      router.push(`/transactions/${res.data.transaction_id}`);
    } catch (error: unknown) {
      setIsSending(false);

      if (error instanceof AxiosError) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  };

  return (
    <GuestMainLayout>
      <div className="p-5">
        <p className="text-center font-bold text-2xl mb-4">
          Send donation to {user.username}
        </p>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          onSubmit={handleSubmit(sendRequest)}
        >
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="amount">Nominal (Rp)</label>
            <input
              required
              type="number"
              className="border py-2 px-3"
              id="amount"
              placeholder="Nominal"
              {...register("amount", { required: true })}
            />
          </div>
          <div className="grid grid-cols-1 gap-1">
            <label htmlFor="donator_name">Nama Pengirim</label>
            <input
              required
              type="text"
              className="border py-2 px-3"
              id="donator_name"
              placeholder="Dari Syahrul"
              {...register("donator_name", { required: true })}
            />
          </div>
          <div className="grid grid-cols-1 gap-1">
            <label htmlFor="donator_email">Email Pengirim</label>
            <input
              required
              type="email"
              className="border py-2 px-3"
              id="donator_email"
              placeholder="mail@mail.com"
              {...register("donator_email", { required: true })}
            />
          </div>
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="message">Pesan</label>
            <textarea
              id="message"
              placeholder="Pesan"
              className="border py-2 px-3"
              {...register("message", { required: true })}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 gap-1 md:col-span-2">
            <label htmlFor="payment_method">Metode Pembayaran</label>
            <div className="flex items-center gap-2">
              <input
                required
                type="radio"
                id="payment_method_qris"
                value="qris"
                {...register("payment_method", { required: true })}
              />
              <label htmlFor="payment_method_qris">QRIS</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                required
                type="radio"
                id="payment_method_bca_va"
                value="bca-virtual-account"
                {...register("payment_method", { required: true })}
              />
              <label htmlFor="payment_method_bca_va">BCA Virtual Account</label>
            </div>
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
        <div className="mt-3">
          {latestDonation && (
            <p>
              {latestDonation.donator.name ?? "-"} baru saja mengirim Rp{" "}
              {latestDonation.amount}
            </p>
          )}
        </div>
      </div>
    </GuestMainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const users: Users = (
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
    ).data;
    const paths = users.user.map((user: User) => ({
      params: {
        username: String(user.username),
      },
    }));

    // We'll prerender only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: "blocking" };
  } catch {
    const paths: {
      params: {
        username: string;
      };
    }[] = [];

    return { paths, fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { username: string };
}) => {
  try {
    let user = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.username}`
    );
    user = user.data.user;

    return {
      props: {
        user,
      },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 5,
    };
  }
};
