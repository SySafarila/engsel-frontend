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
  } catch {
    res.status(401).json({ message: "Failed" });
    return;
  }
}
