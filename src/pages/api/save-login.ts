import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.access_token) {
    throw new Error("access_token required");
  }
  try {
    const jwt = req.body.access_token;
    res
      .status(200)
      .setHeader(
        "Set-Cookie",
        serialize("access_token", jwt, {
          path: "/",
          maxAge: 60 * 60 * 6, // 6 hours expiration
          httpOnly: true,
          secure: true,
        })
      )
      .json({ message: "Login success" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message ?? "error" });
    }
    return;
  }
}
