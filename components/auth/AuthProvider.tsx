"use client";

import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  ADAPTER_EVENTS,
  ADAPTER_STATUS
} from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import {
  OpenloginAdapter,
  OpenloginUserInfo
} from "@web3auth/openlogin-adapter";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import * as React from "react";

import {
  POLYGON_MAINNET_CHAIN_ID,
  POLYGON_TESTNET_CHAIN_ID,
  SESSION_KEY_ORDER_QUERIES,
  SESSION_KEY_USER
} from "lib/constants";
import * as Errors from "lib/errors";
import RPC from "lib/ethersRPC";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type Adapter = "openlogin" | "metamask";
export type LoginMethod = "metamask" | "google" | "facebook" | "kakao";

interface AuthStateType {
  adapter: Adapter | null;
  chainId: string;
  loginMethod: LoginMethod | null;
  email?: string;
  walletAddress: string | null;
  web3auth: Web3Auth | null;
}

export interface AuthContextType extends AuthStateType {
  // token?: string;
  error?: any;
  init: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signMessage: (message: string) => Promise<string | undefined>;
  getBalance: () => Promise<bigint | undefined>;
  getBalanceOf: (
    address: string,
    tokenId: string
  ) => Promise<bigint | undefined>;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return React.useContext(AuthContext);
};

const CHAIN_CONFIG = {
  MAINNET: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: POLYGON_MAINNET_CHAIN_ID,
    rpcTarget: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    displayName: "Polygon Mainnet",
    blockExplorer: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "Matic"
  },
  TESTNET: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: POLYGON_TESTNET_CHAIN_ID,
    rpcTarget: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    displayName: "Polygon Testnet",
    blockExplorer: "https://mumbai.polygonscan.com/",
    ticker: "MATIC",
    tickerName: "Matic"
  }
};

const METHODS_TO_HIDE = [
  "twitter",
  "reddit",
  "discord",
  "twitch",
  "apple",
  "github",
  "linkedin",
  "weibo",
  "wechat",
  "line",
  "email_passwordless",
  "sms_passwordless"
];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] =
    React.useState<SafeEventEmitterProvider | null>(null);
  const [authState, setAuthState] = React.useState<AuthStateType>({
    adapter: null,
    chainId: "",
    loginMethod: null,
    email: undefined,
    walletAddress: "",
    web3auth: null
  });
  const [error, setError] = React.useState<string | null>(null);

  const isModalVisible = React.useRef(false);

  const signMessage = React.useCallback(
    async (message: string) => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      try {
        const signedMessage = await rpc.signMessage(message);
        return signedMessage;
      } catch (e) {
        setError(Errors.SIGN_FAILED);
      }
    },
    [provider]
  );

  const subscribeAuthEvents = React.useCallback((web3auth: Web3Auth) => {
    web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data: any) => {
      if (isModalVisible.current) {
        // when reconnected with metamask module, web3auth modal can stil be shown.
        web3auth.loginModal.closeModal();
      }
      const { adapter } = data;

      const isMetamask = adapter === "metamask" || adapter?.includes("wallet");
      const userInfo = isMetamask ? null : await web3auth.getUserInfo();
      const loginMethod = getOpenloginMethod(userInfo);
      const email = userInfo?.email;
      setAuthState(state => ({
        ...state,
        adapter: isMetamask ? "metamask" : adapter,
        loginMethod,
        email
      }));

      // gtag.loginEvent(loginMethod);
    });

    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      setAuthState(state => ({
        ...state,
        walletAddress: null,
        token: null,
        chainId: "",
        adapter: null,
        loginMethod: null,
        email: undefined
      }));
      setProvider(null);
    });

    web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, isVisible => {
      isModalVisible.current = isVisible;
    });
  }, []);

  const getOpenloginMethod = (userInfo: Partial<OpenloginUserInfo> | null) => {
    if (!userInfo) return "metamask";
    const { typeOfLogin } = userInfo;
    let loginMethod = typeOfLogin;
    if (typeOfLogin === "jwt") {
      loginMethod = "kakao";
    }
    return loginMethod as LoginMethod;
  };

  const init = React.useCallback(async () => {
    try {
      const _web3auth = new Web3Auth({
        clientId: process.env.WEB3AUTH_CLIENT_ID as string,
        web3AuthNetwork: process.env.TARGET === "dev" ? "testnet" : "mainnet",
        chainConfig:
          process.env.TARGET === "dev"
            ? CHAIN_CONFIG.TESTNET
            : CHAIN_CONFIG.MAINNET,
        uiConfig: {
          theme: "light",
          loginMethodsOrder: ["google", "facebook", "kakao"],
          appLogo: "/images/logo-192x192.png",
          primaryButton: "externalLogin"
        }
      });
      subscribeAuthEvents(_web3auth);

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: process.env.TARGET === "dev" ? "testnet" : "mainnet",
          clientId: process.env.WEB3AUTH_CLIENT_ID,
          uxMode: "redirect",
          replaceUrlOnRedirect: false,
          whiteLabel: {
            name: "3PM Studio",
            dark: false,
            defaultLanguage: "en"
          }
        },
        loginSettings: {
          mfaLevel: "none"
        }
      });
      _web3auth.configureAdapter(openloginAdapter);
      setAuthState(state => ({ ...state, web3auth: _web3auth }));

      const loginMethodsConfig: any = {};
      METHODS_TO_HIDE.forEach(method => {
        loginMethodsConfig[method] = {
          name: method,
          showOnModal: false
        };
      });
      await _web3auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: "openlogin",
            loginMethods: loginMethodsConfig
          },
          [WALLET_ADAPTERS.TORUS_EVM]: {
            label: "torus",
            showOnModal: false
          }
        }
      });

      if (_web3auth.provider) {
        setProvider(_web3auth.provider);
      }
    } catch (e) {
      setError(Errors.UNKNOWN_ERROR);
    }
  }, [subscribeAuthEvents]);

  React.useEffect(() => {
    const handleChainChangeOnMetamask = (chainId: string) => {
      const validChainId =
        process.env.TARGET === "dev"
          ? POLYGON_TESTNET_CHAIN_ID
          : POLYGON_MAINNET_CHAIN_ID;
      if (chainId === validChainId) {
        init(); // init does not proceed on the wrong network
      }
    };
    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChangeOnMetamask);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "chainChanged",
          handleChainChangeOnMetamask
        );
      }
    };
  }, [init]);

  React.useEffect(() => {
    const handleLoggedIn = () => {
      const rpc = new RPC(provider!);
      Promise.all([rpc.getAccounts(), rpc.getChainId()])
        .then(([walletAddress, chainId]) => {
          setAuthState(state => ({
            ...state,
            walletAddress,
            chainId
          }));
        })
        .catch(() => setError(Errors.UNKNOWN_ERROR));

      provider!.on("chainChanged", chainId => {
        setAuthState(state => ({ ...state, chainId }));
      });
    };

    if (provider && authState.web3auth?.connected) {
      handleLoggedIn();
    }
  }, [provider, authState.web3auth?.connected]);

  const login = React.useCallback(async () => {
    if (!authState.web3auth) {
      return;
    }
    if (isModalVisible.current) {
      authState.web3auth.loginModal.closeModal();
    }
    try {
      const web3authProvider = await authState.web3auth.connect();
      setProvider(web3authProvider);
    } catch (e: any) {
      if (e.code !== -32002) {
        setError(Errors.CONNECT_FAILED);
      }
    }
  }, [authState.web3auth]);

  const logout = React.useCallback(async () => {
    if (
      !authState.web3auth ||
      authState.web3auth.status === ADAPTER_STATUS.DISCONNECTED
    ) {
      return;
    }
    await authState.web3auth.logout();
    sessionStorage.removeItem(SESSION_KEY_USER);
    sessionStorage.removeItem(SESSION_KEY_ORDER_QUERIES);
    setProvider(null);
  }, [authState.web3auth]);

  const getBalance = React.useCallback(async () => {
    if (!provider) {
      return;
    }
    const rpc = new RPC(provider);
    try {
      const balance = await rpc.getBalance();
      return balance;
    } catch (e) {
      setError(Errors.UNKNOWN_ERROR);
    }
  }, [provider]);

  const getContract = React.useCallback(
    async (address: string) => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      const contract = await rpc.getContract(address);
      return contract;
    },
    [provider]
  );

  const getBalanceOf = React.useCallback(
    async (address: string, tokenId: string) => {
      if (!provider) {
        return;
      }
      const rpc = new RPC(provider);
      const balanceOf = await rpc.getBalanceOf(address, tokenId);

      return balanceOf;
    },
    [provider]
  );

  const value = React.useMemo(
    () => ({
      ...authState,
      // token,
      error,
      init,
      login,
      logout,
      signMessage,
      getBalance,
      getBalanceOf
    }),
    [
      authState,
      // token,
      error,
      init,
      login,
      logout,
      signMessage,
      getBalance,
      getBalanceOf
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
