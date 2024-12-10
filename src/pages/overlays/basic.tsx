import BasicOverlay from "@/components/overlays/Basic";
import Connecting from "@/components/overlays/Connecting";
import Dom from "@/utils/Dom";
import Queue from "@/utils/Queue";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Formula1 = () => {
  const router = useRouter();
  const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/donations`, {
    autoConnect: false,
  });
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

  return (
    <div className="p-2">
      {isConnected === false && <Connecting />}
      {isConnected === true && <BasicOverlay />}
    </div>
  );
};

export default Formula1;
