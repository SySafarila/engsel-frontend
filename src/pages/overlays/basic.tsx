import Queue from "@/utils/Queue";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Formula1 = () => {
  const router = useRouter();
  const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/donations`, {
    autoConnect: false,
  });
  const [css, setCss] = useState<{
    background: string;
    border_color: string;
    text_color: string;
    text_color_highlight: string;
  }>();
  const [settingLoaded, setSettingLoaded] = useState(false);
  const donationRef = useRef(null);

  const getBasicOverlaySetting = async () => {
    console.log("Get setting");

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/basic`,
        {
          params: {
            streamkey: router.query.streamkey,
          },
        }
      );
      setSettingLoaded(true);
      setCss(res.data.data.value);
    } catch (error) {
      setSettingLoaded(true);
      if (error instanceof AxiosError) {
        console.error(error.status, error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      getBasicOverlaySetting();
      const queue = new Queue();

      if (!router.query.preview) {
        socket.connect();
      }

      socket.on("connect", () => {
        socket.emit("join", router.query.streamkey);
      });

      socket.on("donation", queue.incomingDonation);
    }

    return () => {
      socket.off("donation");
      socket.off("connect");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // useEffect for preview
  useEffect(() => {
    if (
      router.isReady &&
      router.query.preview == "true" &&
      donationRef.current
    ) {
      const el: HTMLElement = donationRef.current;
      setInterval(() => {
        el.classList.toggle("hidden");
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (css && donationRef.current) {
      console.log("apply setting");
      const el = donationRef.current as HTMLElement;

      el.setAttribute(
        "style",
        `background: ${css.background} !important; border-color: ${css.border_color} !important; color: ${css.text_color} !important;`
      );
      el.querySelector("#donatorName")?.setAttribute(
        "style",
        `color: ${css.text_color_highlight} !important;`
      );
      el.querySelector("#amount")?.setAttribute(
        "style",
        `color: ${css.text_color_highlight} !important;`
      );
    }
  }, [css]);

  return (
    <>
      {settingLoaded && (
        <div
          className={`border border-black p-3 bg-[#faae2b] m-2 ${
            router.query.preview == "true" ? "" : "hidden"
          }`}
          id="donation"
          ref={donationRef}
        >
          <p className="text-center">
            <span id="donatorName" className="font-semibold text-[#744fc9]">
              Syahrul
            </span>{" "}
            <span id="templateText">baru saja memberikan </span>
            <span className="font-semibold text-[#744fc9]" id="amount">
              Rp 20,000
            </span>
          </p>
          <p className="text-center" id="message">
            Halo bang
          </p>
        </div>
      )}
    </>
  );
};

export default Formula1;
