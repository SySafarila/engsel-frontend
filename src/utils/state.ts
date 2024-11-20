import { atom } from "jotai";
import { User } from "./types";

export const isAuthAtom = atom(false);
export const userAtom = atom<null | User>(null);
export const accessTokenAtom = atom<string | null>(null);
