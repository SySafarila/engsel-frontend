import Connecting from "@/components/overlays/Connecting";
import Radio from "@/components/overlays/F1Radio";
import DomF1Radio from "@/utils/DomF1Radio";
import QueueF1Radio from "@/utils/QueueF1Radio";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const F1Radio = () => {
  const router = useRouter();
  const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/donations`, {
    autoConnect: false,
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const queue = new QueueF1Radio({
        DOM: new DomF1Radio(),
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

  return (
    <div className="p-2">
      {isConnected === false && <Connecting />}
      {isConnected === true && <Radio />}
    </div>
  );
};

export default F1Radio;
