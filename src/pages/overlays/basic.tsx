import Dom from "@/utils/Dom";
import Queue from "@/utils/Queue";
import { OverlayBasicCss } from "@/utils/types";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Formula1 = ({ css }: { css: OverlayBasicCss | null }) => {
  const router = useRouter();
  const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/donations`, {
    autoConnect: false,
  });
  const donationRef = useRef(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const queue = new Queue({
        DOM: new Dom(),
      });

      if (!router.query.preview) {
        socket.connect();
      }

      if (router.query.preview == "true") {
        setIsConnected(true);
      }

      socket.on("connect", () => {
        setIsConnected(true);
        socket.emit("join", router.query.streamkey);

        socket.on("disconnect", () => {
          setIsConnected(false);
        });
      });

      socket.on("donation", queue.incomingDonation);
    }

    return () => {
      socket.off("donation");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
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
  }, [css, isConnected]);

  return (
    <>
      {isConnected === false && (
        <div className="border p-3 py-2 border-black bg-white m-2">
          <p>Connecting...</p>
        </div>
      )}
      {isConnected === true && (
        <div
          className={`border-2 border-black p-3 bg-[#faae2b] m-2 ${
            router.query.preview == "true" ? "" : "hidden"
          }`}
          id="donation"
          ref={donationRef}
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
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.query.streamkey) {
    return {
      notFound: true,
    };
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/overlays/basic`,
      {
        params: {
          streamkey: context.query.streamkey,
        },
      }
    );
    const css = res.data.data.value as OverlayBasicCss;
    return {
      props: {
        css: css,
      },
    };
  } catch {
    return {
      props: {
        css: null,
      },
    };
  }
}

export default Formula1;
