import BasicOverlay from "@/components/overlays/Basic";
import F1Radio from "@/components/overlays/F1Radio";
import { Button } from "@/components/ui/button";
import NewAuth from "@/layouts/NewAuth";
import { NextPageWithLayout } from "@/pages/_app";
import { userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Overlay: NextPageWithLayout = () => {
  const [origin, setOrigin] = useState<null | string>(null);
  const user = useAtomValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setOrigin(window.location.origin);
    }
  }, [router.isReady]);

  const copyOverlay = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Overlay Berhasil Dicopy",
      });
    } catch (error) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  };

  const testDonation = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/test`,
        null,
        {
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Sukses",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Overlay</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-gray-100 p-3 border grid gap-2">
          <div className="flex flex-col gap-2">
            <p>Overlay Basic</p>
            <BasicOverlay isPreview={true} />
            <div className="grid grid-cols-3 gap-1">
              <Button
                type="button"
                onClick={() =>
                  copyOverlay(`${origin}/overlays/basic?streamkey=${user?.id}`)
                }
              >
                Copy Link
              </Button>
              <Button asChild>
                <a
                  href={`${origin}/overlays/basic?streamkey=${user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka Tab Baru
                </a>
              </Button>
              <Button type="button" onClick={testDonation}>
                Test
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/dashboard/overlays/basic/setting")}
                className="col-span-3"
              >
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-3 border grid gap-2">
          <div className="flex flex-col gap-2">
            <p>Formula 1 Radio</p>
            <F1Radio isPreview={true} />
            <div className="grid grid-cols-3 gap-1">
              <Button
                type="button"
                onClick={() =>
                  copyOverlay(
                    `${origin}/overlays/f1-radio?streamkey=${user?.id}`
                  )
                }
              >
                Copy Link
              </Button>
              <Button asChild>
                <a
                  href={`${origin}/overlays/f1-radio?streamkey=${user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka Tab Baru
                </a>
              </Button>
              <Button type="button" onClick={testDonation}>
                Test
              </Button>
              <Button
                type="button"
                className="col-span-3"
                onClick={() =>
                  router.push("/dashboard/overlays/f1-radio/setting")
                }
              >
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;

Overlay.getLayout = (page: ReactElement) => {
  return <NewAuth>{page}</NewAuth>;
};
