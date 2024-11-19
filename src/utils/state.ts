import { atom } from "jotai";

export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
};

export const isAuthAtom = atom(false);
export const userAtom = atom<null | User>(null);
export const accessTokenAtom = atom<string | null>(null);
