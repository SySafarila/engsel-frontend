import axios from "axios";

export const logout = async (): Promise<void> => {
  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, null, {
    withCredentials: true,
  });
};
