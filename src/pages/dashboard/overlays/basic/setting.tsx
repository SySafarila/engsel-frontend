import MainLayout from "@/components/layouts/MainLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { userAtom } from "@/utils/state";
import { OverlayBasicCss } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const BasicOverlaySetting: NextPageWithLayout = () => {
  const user = useAtomValue(userAtom);
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (user) {
      getCurrentSetting();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getCurrentSetting = async () => {
    try {
      if (!user) {
        return;
      }
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/basic`,
        {
          params: {
            streamkey: user.id,
          },
        }
      );
      const css = res.data.data.value as OverlayBasicCss;
      setValue("background", css.background);
      setValue("border_color", css.border_color);
      setValue("text_color", css.text_color);
      setValue("text_color_highlight", css.text_color_highlight);
    } catch (error) {
      setValue("background", "#faae2b");
      setValue("border_color", "black");
      setValue("text_color", "black");
      setValue("text_color_highlight", "#744fc9");

      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
    }
  };

  const onSubmit = async (data: unknown) => {
    const values = data as OverlayBasicCss;
    if (isSending) {
      return;
    }

    try {
      setIsSending(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/basic`,
        {
          background: values.background,
          text_color: values.text_color,
          text_color_highlight: values.text_color_highlight,
          border_color: values.border_color,
        },
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Pengaturan berhasil diubah!",
      });
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
    }
  };

  const resetSetting = async () => {
    if (isSending) {
      return;
    }

    try {
      setIsSending(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/basic`,
        null,
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Pengaturan berhasil direset!",
      });
      await getCurrentSetting();
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Basic Overlay Setting</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="background">Background Color</label>
          <input
            type="color"
            id="background"
            {...register("background", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="border_color">Border Color</label>
          <input
            type="color"
            id="border_color"
            {...register("border_color", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="text_color">Text Color</label>
          <input
            type="color"
            id="text_color"
            {...register("text_color", { required: true })}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="text_color_highlight">Text Highlight Color</label>
          <input
            type="color"
            id="text_color_highlight"
            {...register("text_color_highlight", { required: true })}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 px-3 py-2 text-white disabled:bg-gray-200 disabled:text-black"
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Loading..." : "Update"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white disabled:bg-gray-200 disabled:text-black"
            type="button"
            onClick={resetSetting}
            disabled={isSending}
          >
            {isSending ? "Loading..." : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicOverlaySetting;

BasicOverlaySetting.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
