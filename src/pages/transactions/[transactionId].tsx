import { useRouter } from "next/router";
import { useEffect } from "react";

const TransactionDetail = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getDetailTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const getDetailTransaction = async () => {
    console.log(router.query);
  };

  return <p>Transaction</p>;
};

export default TransactionDetail;
