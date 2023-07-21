import { User } from "types/user";

import { SESSION_KEY_USER } from "./constants";

export const getStoredUser = (walletAddress: string): User | null => {
  const storedUserString = sessionStorage.getItem(SESSION_KEY_USER);
  if (storedUserString) {
    const storedUser = JSON.parse(storedUserString);
    if (storedUser.wallet_address === walletAddress) {
      return storedUser;
    } else {
      sessionStorage.removeItem(SESSION_KEY_USER);
    }
  }
  return null;
};

export const storeUser = (user: User) => {
  sessionStorage.setItem(SESSION_KEY_USER, JSON.stringify(user));
};
