import F1Radio from "@/components/overlays/F1Radio";
import AuthLayout from "@/layouts/Auth";
import { NextPageWithLayout } from "@/pages/_app";
import F1RadioOverlayUtil from "@/utils/F1RadioOverlayUtil";
import { userAtom } from "@/utils/state";
import { F1RadioSettings } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const BasicOverlaySetting: NextPageWithLayout = () => {
  const user = useAtomValue(userAtom);
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, setValue, getValues } = useForm();

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/f1-radio`,
        {
          params: {
            streamkey: user.id,
          },
        }
      );
      console.log(res.data);

      const settings = res.data.data.value;
      console.log(settings);

      setValue("driver_name", settings.driver_name);
      setValue("team", settings.team);
      F1RadioOverlayUtil.setSettings(settings);
      // setValue("text_color", css.text_color);
      // setValue("text_color_highlight", css.text_color_highlight);
    } catch (error) {
      setValue("driver_name", "Leclerc");
      setValue("team", "ferrari");

      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      }
    }
  };

  const onSubmit = async (data: unknown) => {
    const values = data as F1RadioSettings;
    if (isSending) {
      return;
    }

    try {
      setIsSending(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/f1-radio`,
        {
          driver_name: values.driver_name,
          team: values.team,
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
      F1RadioOverlayUtil.setSettings(values);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/f1-radio`,
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

  const previewSetting = () => {
    const settings = getValues() as F1RadioSettings;
    console.log(settings);

    F1RadioOverlayUtil.setSettings(settings);
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <h1 className="text-2xl">Basic Overlay Setting</h1>
      <F1Radio isPreview={true} />
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="driver_name">Driver Name</label>
          <input
            type="text"
            id="driver_name"
            {...register("driver_name", { required: true })}
            onKeyUp={previewSetting}
            className="border p-2"
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:col-span-2">
          <label htmlFor="team">Team</label>
          <select
            id="team"
            {...register("team", { required: true })}
            onClick={previewSetting}
            className="border p-2 appearance-none"
          >
            <option value="ferrari">Ferrari</option>
            <option value="mercedes">Mercedes</option>
            <option value="redbull">Red Bull</option>
            <option value="mclaren">McLaren</option>
            <option value="aston-martin">Aston Martin</option>
            <option value="haas">Haas</option>
            <option value="rb">RB</option>
            <option value="williams">Williams</option>
            <option value="alpine">Alpine</option>
            <option value="sauber">Sauber</option>
          </select>
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
  return <AuthLayout>{page}</AuthLayout>;
};
