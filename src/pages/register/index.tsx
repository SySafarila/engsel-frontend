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

const Register: NextPageWithLayout = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: {
    email?: string;
    password?: string;
    name?: string;
    username?: string;
  }) => {
    if (isSending === true) {
      return;
    }

    setIsSending(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        email: data.email?.toLowerCase(),
        password: data.password,
        name: data.name,
        username: data.username?.toLowerCase(),
      });

      setIsSending(false);

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Silahkan login",
      }).then(() => {
        router.push("/login");
      });
    } catch (error) {
      setIsSending(false);

      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          text: error.response?.data.message,
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
            <BreadcrumbPage>Daftar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Daftar</CardTitle>
          <CardDescription>
            Buat akun kamu dengan mengisi formulir di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="register-form">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Lengkap"
                  {...register("name", { required: true })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: true,
                    pattern: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
                    onBlur: () =>
                      setValue("username", getValues("username").toLowerCase()),
                  })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    onBlur: () =>
                      setValue("email", getValues("email").toLowerCase()),
                  })}
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
            <Link href="/login">Masuk</Link>
          </Button>
          <Button type="submit" form="register-form">
            Daftar!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;

Register.getLayout = (page: ReactElement) => {
  return <GuestMainLayout>{page}</GuestMainLayout>;
};
