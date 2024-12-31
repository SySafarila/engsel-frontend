import F1RadioOverlayUtil from "@/utils/F1RadioOverlayUtil";
import { userAtom } from "@/utils/state";
import axios, { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

/* eslint-disable @next/next/no-img-element */
type Params = {
  isPreview?: boolean;
};
const F1Radio = (params: Params) => {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (params.isPreview == true) {
      const audioVisuals: NodeListOf<Element> =
        document.querySelectorAll("#audio-visual div");

      audioVisuals.forEach((el) => {
        el.setAttribute("style", `height: ${Math.random() * 100}%`);
      });
    }
  }, [params.isPreview]);

  useEffect(() => {
    if (user || router.isReady) {
      getCurrentSetting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router.isReady]);

  const getCurrentSetting = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/f1-radio`,
        {
          params: {
            streamkey: router.query.streamkey ?? user?.id,
          },
        }
      );
      console.log(res.data);

      const settings = res.data.data.value;
      F1RadioOverlayUtil.setSettings(settings);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.log(error.response.data.message);
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <div
      className={`ferrari ${params.isPreview == true ? "" : "hidden"}`}
      id="radio"
    >
      <div className="bg-driver">
        <div className="flex flex-col items-end w-full p-4 gap-2">
          <span
            className="uppercase font-f1-bold font-bold text-4xl italic break-words text-right leading-none"
            id="driver-name"
          >
            Leclerc
          </span>
          <div className="flex items-center gap-x-2 w-full justify-end">
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/ferrari-ges.svg"
              alt="Ferrari"
              id="constructor"
              data-constructor="ferrari"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/mercedes.svg"
              alt="Mercedes"
              id="constructor"
              data-constructor="mercedes"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/redbull.svg"
              alt="Red Bull"
              id="constructor"
              data-constructor="redbull"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/mclaren.svg"
              alt="Mclaren"
              id="constructor"
              data-constructor="mclaren"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/aston-martin.svg"
              alt="Aston Martin"
              id="constructor"
              data-constructor="aston-martin"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/haas.svg"
              alt="HAAS"
              id="constructor"
              data-constructor="haas"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/rb.svg"
              alt="Racing Bull"
              id="constructor"
              data-constructor="rb"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/williams.svg"
              alt="Williams"
              id="constructor"
              data-constructor="williams"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/alpine.svg"
              alt="Alpine"
              id="constructor"
              data-constructor="alpine"
            />
            <img
              src="https://raw.githubusercontent.com/SySafarila/Saweria-Formula-1-Radio-Source/refs/heads/main/dist/images/sauber.svg"
              alt="Sauber"
              id="constructor"
              data-constructor="sauber"
            />
            <span
              className="uppercase text-white font-f1-bold font-bold -mt-[6px] text-4xl italic text-right break-words leading-none"
              id="driver-radio"
            >
              Radio
            </span>
          </div>
        </div>
        <div
          className="audio-visual flex justify-between pb-2 px-4 items-end gap-[.3rem] md:gap-4"
          id="audio-visual"
        >
          <div className="transition-all max-h-[50%]" id="h-1"></div>
          <div className="transition-all max-h-[60%]" id="h-2"></div>
          <div className="transition-all max-h-[70%]" id="h-3"></div>
          <div className="transition-all max-h-[80%]" id="h-4"></div>
          <div className="transition-all max-h-[90%]" id="h-5"></div>
          <div className="transition-all max-h-full" id="h-6"></div>
          <div className="transition-all max-h-full" id="h-7"></div>
          <div className="transition-all max-h-full" id="h-8"></div>
          <div className="transition-all max-h-[90%]" id="h-9"></div>
          <div className="transition-all max-h-[80%]" id="h-10"></div>
          <div className="transition-all max-h-[70%]" id="h-11"></div>
          <div className="transition-all max-h-[60%]" id="h-12"></div>
          <div className="transition-all max-h-[50%]" id="h-13"></div>
        </div>
        <hr className="border-t-2 pb-2" />
      </div>
      <div className="bg-message flex flex-col gap-4">
        <p
          className="uppercase text-left text-white text-xl italic p-4 pb-0 font-semibold break-words w-[95%] mr-auto leading-none"
          id="donation"
        >
          &ldquo;<span id="donatorName">Someguy</span>{" "}
          <span id="amount">Rp 70,000</span>&rdquo;
        </p>
        <p
          className="uppercase text-right text-xl italic p-4 pt-0 font-semibold break-words w-[95%] ml-auto leading-none"
          id="message"
        >
          &ldquo;Man, the aplhatauri is such an idiot&rdquo;
        </p>
      </div>
    </div>
  );
};

export default F1Radio;
