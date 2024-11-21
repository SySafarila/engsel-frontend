import MainLayout from "@/components/layouts/MainLayout";
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

  const copyBasicOverlay = async () => {
    try {
      await navigator.clipboard.writeText(
        `${origin}/overlays/basic?streamkey=${user?.id}`
      );
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Basic Overlay Berhasil Dicopy",
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
        <div className="bg-gray-100 p-3 border">
          <p>Overlay Basic</p>
          {/* <p>{`${origin}/overlays/basic/${user?.id}`}</p> */}
          {user && origin && (
            <iframe
              src={`${origin}/overlays/basic?streamkey=${user?.id}`}
              className="w-full"
            ></iframe>
          )}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 py-2"
              onClick={copyBasicOverlay}
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
