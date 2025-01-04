const Connecting = () => {
  return (
    <div className="border p-3 py-2 border-black bg-white">
      <p>Connecting to {process.env.NEXT_PUBLIC_BRAND_NAME} server...</p>
    </div>
  );
};

export default Connecting;
