import { atom } from "jotai";

export const isAuthAtom = atom(false);
export const userAtom = atom<null | { name: string; email: string }>(null);
export const accessTokenAtom = atom<string | null>(null);
