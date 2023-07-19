"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { useAuth } from "./AuthProvider";

const withAuth = (WrappedComponent: JSX.ElementType) => {
  const AuthComponent = (props: any) => {
    const t = useTranslations("auth");
    const authInfo = useAuth();
    const { web3auth, error, init, login } = authInfo;

    React.useEffect(() => {
      if (init && login) {
        if (!web3auth) {
          init();
        } else if (!web3auth?.connected && !error) {
          setTimeout(() => {
            login();
          }, 800);
        }
      }
    }, [web3auth, init, login, error]);

    if (!web3auth?.connected || error) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary text-white">
          {!web3auth ? (
            "Initializing..."
          ) : (
            <p className="whitespace-pre text-center">{t("signInRequired")}</p>
          )}
        </div>
      );
    }

    return <WrappedComponent {...props} {...authInfo} />;
  };

  return AuthComponent;
};

export default withAuth;
