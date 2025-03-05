import GuestMainLayout from "@/components/layouts/GuestMainLayout";
import formatRupiah from "@/utils/formatRupiah";
import { Donation } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { NextPageWithLayout } from "../_app";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type User = {
  id: string;
  name: string;
  username: string;
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

const User: NextPageWithLayout<{ user: User; minTts: number }> = ({
  user,
  minTts,
}) => {
  const { register, handleSubmit, setValue } = useForm();
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

  const sendDonation = async (data: SendRequest) => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/${user.username}/donate`,
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

  const handlePaymentMethodSelect = (value: string) => {
    setValue("payment_method", value);
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={handleSubmit(sendDonation)}
      >
        <div className="flex flex-col space-y-1.5 md:col-span-2">
          <Label htmlFor="amount">Nominal (Rp)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Nominal"
            {...register("amount", { required: true })}
          />
          <small>Minimal Rp {formatRupiah(minTts)} untuk Text-To-Speech</small>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="donator_name">Nama</Label>
          <Input
            id="donator_name"
            type="text"
            placeholder="Nama kamu"
            {...register("donator_name", { required: true })}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="donator_email">Email</Label>
          <Input
            id="donator_email"
            type="email"
            placeholder="Nama kamu"
            {...register("donator_email", { required: true })}
          />
        </div>
        <div className="flex flex-col space-y-1.5 md:col-span-2">
          <Label htmlFor="message">Pesan</Label>
          <Textarea
            id="message"
            placeholder="Pesan"
            {...register("message", { required: true })}
          />
        </div>
        <div className="flex flex-col space-y-1.5 md:col-span-2">
          <Label htmlFor="payment_method">Metode Pembayaran</Label>
          <Select onValueChange={handlePaymentMethodSelect} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>General</SelectLabel>
                <SelectItem value="qris">QRIS</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Virtual Account</SelectLabel>
                <SelectItem value="bca-virtual-account" disabled>
                  BCA
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button type="submit" disabled={isSending}>
            {isSending ? "Loading..." : "Kirim"}
          </Button>
        </div>
      </form>
      <div className="mt-3">
        {latestDonation && (
          <p>
            {latestDonation.donator_name ?? "-"} baru saja mengirim Rp{" "}
            {latestDonation.amount}
          </p>
        )}
      </div>
    </div>
  );
};
export default User;

User.getLayout = (page: ReactElement) => {
  return <GuestMainLayout>{page}</GuestMainLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const paths: {
      params: {
        username: string;
      };
    }[] = [];

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
    const res = await axios.get(
      `${process.env.BACKEND_URL}/users/${params.username}`
    );
    const user = res.data.data.user;
    const minTts = res.data.data.minTts;

    return {
      props: {
        user,
        minTts,
      },
      revalidate: 30,
    };
  } catch {
    console.log(`${params.username} not found`);
    return {
      notFound: true,
      revalidate: 5,
    };
  }
};
