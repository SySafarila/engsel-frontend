import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_token: string | undefined = req.cookies.access_token;
  if (!access_token) {
    res.status(200).json({
      message: "token not set",
      access_token: null,
    });
  }
  res.status(200).json({
    message: "success",
    access_token: access_token,
  });
}
