import Queue from "@/utils/Queue";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Formula1 = () => {
  const router = useRouter();
  const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/donations`, {
    autoConnect: false,
  });
  const donationRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
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

  return (
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
  );
};

export default Formula1;
