import BasicOverlayUtil from "@/utils/BasicOverlayUtil";
import { userAtom } from "@/utils/state";
import { OverlayBasicCss } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Params = {
  isPreview?: boolean;
};

const BasicOverlay = (params: Params) => {
  const user = useAtomValue(userAtom);
  const [css, setCss] = useState<null | OverlayBasicCss>(null);
  const router = useRouter();

  useEffect(() => {
    if (user || router.isReady) {
      getCurrentSetting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router.isReady]);

  useEffect(() => {
    applySetting();
  }, [css]);

  const getCurrentSetting = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/basic`,
        {
          params: {
            streamkey: router.query.streamkey ?? user?.id,
          },
        }
      );

      const css = res.data.data.value as OverlayBasicCss;
      setCss(css);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.log(error.response.data.message);
        } else {
          console.error(error);
        }
      }
    }
  };

  const applySetting = () => {
    console.log("apply setting");
    if (css) {
      BasicOverlayUtil.setStyle(css);
    }
  };

  return (
    <div
      className={`border-2 border-black p-3 bg-[#faae2b] ${
        params.isPreview == true ? "" : "hidden"
      }`}
      id="donation"
    >
      <p className="text-center flex gap-1 justify-center flex-wrap">
        <span id="donatorName" className="font-semibold text-[#744fc9]">
          Syahrul
        </span>
        <span className="text-black" id="templateText">
          baru saja memberikan
        </span>
        <span className="font-semibold text-[#744fc9]" id="amount">
          Rp 20,000
        </span>
      </p>
      <p className="text-center text-black" id="message">
        Halo bang
      </p>
    </div>
  );
};

export default BasicOverlay;
