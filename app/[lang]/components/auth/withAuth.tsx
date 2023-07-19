"use client";

import * as React from "react";

import { useAuth } from "./AuthProvider";
import LoginView from "./LoginView";

const withAuth = (WrappedComponent: JSX.ElementType) => {
  const AuthComponent = (props: any) => {
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
            <p className="text-center">
              로그인이 필요한 페이지입니다.
              <br />
              로그인 창이 뜨지 않으면 새로고침 해 주세요.
            </p>
          )}
        </div>
      );
    }

    return <WrappedComponent {...props} {...authInfo} />;
  };

  return AuthComponent;
};

export default withAuth;
