import axios, { AxiosError } from "axios";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export interface LoginObject {
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await axios.post(
      `${process.env.BACKEND_URL}/auth/logout`,
      null,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    res
      .status(200)
      .setHeader(
        "Set-Cookie",
        serialize("access_token", "logout", {
          path: "/",
          maxAge: 1,
          httpOnly: true,
          secure: true,
        })
      )
      .json({ message: "Logout success" });
    return;
  } catch (error) {
    if (error instanceof AxiosError) {
      res
        .status(error.status ?? 500)
        .json({ message: error.response?.data.message ?? error.message });
      return;
    }
    res.status(401).json({ message: "Failed" });
    return;
  }
}
