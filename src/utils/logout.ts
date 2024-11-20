import axios from "axios";

export const logout = async (): Promise<void> => {
  await axios.post("/api/logout");
};
