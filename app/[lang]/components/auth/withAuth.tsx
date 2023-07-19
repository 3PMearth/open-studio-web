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

    if (!web3auth) {
      return <div>Initializing</div>;
    }

    if (!web3auth?.connected || error) {
      return <LoginView />;
    }

    return <WrappedComponent {...props} {...authInfo} />;
  };

  return AuthComponent;
};

export default withAuth;
