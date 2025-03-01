import GuestMainLayout from "@/components/layouts/GuestMainLayout";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { NextPageWithLayout } from "../_app";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Login: NextPageWithLayout = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const router = useRouter();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: { email?: string; password?: string }) => {
    if (isSending === true) {
      return;
    }

    setIsSending(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      setIsSending(false);

      await Swal.fire({
        icon: "success",
        title: "Sukses",
      }).then(() => {
        router.push("/dashboard");
      });
    } catch (error) {
      setIsSending(false);

      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          text: error.response?.data.message ?? error.message,
        });
      }
    }
  };

  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Masuk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <h1 className="text-2xl">Login Page</h1> */}
      <Card>
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>
            Masuk ke akun kamu untuk melihat dukungan dari para penggemar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="login-form">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/register">Daftar</Link>
          </Button>
          <Button type="submit" form="login-form">
            Masuk!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

Login.getLayout = (page: ReactElement) => {
  return <GuestMainLayout>{page}</GuestMainLayout>;
};
