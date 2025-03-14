import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewAuth from "@/layouts/NewAuth";
import { NextPageWithLayout } from "@/pages/_app";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Donations as DonationsType } from "@/utils/types";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

const Donations: NextPageWithLayout = () => {
  const [donations, setDonations] = useState<DonationsType>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  const getDonations = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations`,
        {
          withCredentials: true,
          params: {
            cursor: router.query.cursor,
          },
        }
      );

      if (router.query.cursor) {
        if (donations.length == 0) {
          setDonations(res.data.donations);
        } else {
          setDonations((current) => current.concat(res.data.donations));
        }
      } else {
        setDonations(res.data.donations);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const replayDonation = async (transactionId: string) => {
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

      const t = toast("Sukses", {
        description: (
          <span
            className="text-muted-foreground"
            onClick={() => toast.dismiss(t)}
          >
            Donasi kembali ditampilkan!
          </span>
        ),
        duration: 5000,
        action: (
          <Button className="ml-auto" onClick={() => toast.dismiss(t)}>
            Ok
          </Button>
        ),
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
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Donasi & Dukungan</h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && donations.length == 0 && <p>Tidak ada data</p>}
      {!isLoading && donations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {donations.map((donation, key) => (
            <Card key={key}>
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <CardTitle>{donation.donator_name ?? "-"}</CardTitle>
                  <span className="text-muted-foreground text-nowrap -mt-1">
                    {formatDate(donation.updated_at)}
                  </span>
                </div>
                <CardTitle>Rp {formatRupiah(donation.amount)}</CardTitle>
                <CardDescription>
                  {donation.donator_email ?? "-"}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid mt-3">
                <p>&quot;{donation.message}&quot;</p>
                <Button
                  className="mt-4"
                  variant={"outline"}
                  onClick={() => replayDonation(donation.id)}
                >
                  Replay
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button className="md:col-span-2" asChild>
            <Link
              href={`/dashboard/donations?cursor=${
                donations[donations.length - 1].id
              }`}
              scroll={false}
            >
              More
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Donations;

Donations.getLayout = (page: ReactElement) => {
  return <NewAuth>{page}</NewAuth>;
};
