import GuestMainLayout from "@/components/layouts/GuestMainLayout";

export default function Home() {
  return (
    <GuestMainLayout>
      <div className="p-5 grid gap-y-5">
        <p>Selamat datang di {process.env.NEXT_PUBLIC_BRAND_NAME}</p>
      </div>
    </GuestMainLayout>
  );
}
