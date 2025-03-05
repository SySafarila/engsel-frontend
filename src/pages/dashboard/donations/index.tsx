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
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Donasi & Dukungan</h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && donations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {donations.map((donation, key) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{donation.donator_name ?? "-"}</CardTitle>
                <CardDescription>
                  {donation.donator_email ?? "-"}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid">
                <p>&quot;{donation.message}&quot;</p>
                <p>Rp {formatRupiah(donation.amount)}</p>
                <small className="text-muted-foreground">
                  {formatDate(donation.updated_at)}
                </small>
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
      {!isLoading && donations.length == 0 && <p>Tidak ada data</p>}
    </div>
  );
};

export default Donations;

Donations.getLayout = (page: ReactElement) => {
  return <NewAuth>{page}</NewAuth>;
};
