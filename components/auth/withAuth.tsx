"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { getUser } from "api";
import { getStoredUser, storeUser } from "lib/user";

import { useAuth } from "./AuthProvider";
import SignUp from "./SignUp";

const withAuth = (WrappedComponent: JSX.ElementType) => {
  const AuthComponent = (props: any) => {
    const t = useTranslations("auth");

    const { web3auth, walletAddress, loginMethod, error, init, login } =
      useAuth();

    const [userId, setUserId] = React.useState<string | null>("");

    React.useEffect(() => {
      if (init && login) {
        if (!web3auth) {
          init();
        } else if (!web3auth?.connected && !error) {
          login();
        }
      }
    }, [web3auth, init, login, error]);

    React.useEffect(() => {
      const fetchUser = async () => {
        let user = getStoredUser(walletAddress!);
        if (!user) {
          user = await getUser(walletAddress!);
          if (user) {
            storeUser(user);
          }
        }
        setUserId(user ? user.id : null);
      };

      if (walletAddress) {
        fetchUser();
      }
    }, [walletAddress]);

    if (walletAddress && loginMethod && !error && userId !== "") {
      return userId ? (
        <WrappedComponent
          {...props}
          walletAddress={walletAddress}
          userId={userId}
        />
      ) : (
        <SignUp
          walletAddress={walletAddress}
          loginMethod={loginMethod}
          onCreateUser={_userId => setUserId(_userId)}
        />
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary text-white">
        {!web3auth ? (
          "Initializing..."
        ) : (
          <p className="whitespace-pre text-center">
            {error ? error : t("signInRequired")}
          </p>
        )}
      </div>
    );
  };

  return AuthComponent;
};

export default withAuth;
