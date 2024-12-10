import MainLayout from "@/components/layouts/MainLayout";
import BasicOverlay from "@/components/overlays/Basic";
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
      <div className="gris grid-cols-1 gap-3">
        <div className="bg-gray-100 p-3 border grid gap-2">
          <p>Overlay Basic</p>
          <BasicOverlay isPreview={true} />
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 py-2"
              onClick={() =>
                copyOverlay(`${origin}/overlays/basic?streamkey=${user?.id}`)
              }
            >
              Copy Link
            </button>
            <a
              href={`${origin}/overlays/basic?streamkey=${user?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-center py-2"
            >
              Buka Tab Baru
            </a>
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 py-2"
              onClick={testDonation}
            >
              Test
            </button>
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 py-2 col-span-3"
              onClick={() => router.push("/dashboard/overlays/basic/setting")}
            >
              Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;

Overlay.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
