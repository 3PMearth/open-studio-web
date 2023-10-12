import type { SafeEventEmitterProvider } from '@web3auth/base';
import { ethers } from 'ethers';

import { ThreePMabi } from './abi';
export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;
  private ethersProvider: ethers.BrowserProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
    this.ethersProvider = new ethers.BrowserProvider(provider);
  }

  async getChainId(): Promise<any> {
    try {
      // Get the connected Chain's ID
      const networkDetails = await this.ethersProvider.getNetwork();
      return networkDetails.chainId;
    } catch (error: any) {
      throw error.message;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const signer = await this.ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();

      return address;
    } catch (error: any) {
      throw error.message;
    }
  }

  async getBalance(): Promise<bigint> {
    try {
      const address = await this.getAccounts();
      const balance = await this.ethersProvider.getBalance(address);

      return balance;
    } catch (error: any) {
      throw error.message;
    }
  }

  async signMessage(originalMessage: string) {
    try {
      const signer = await this.ethersProvider.getSigner();

      const signedMessage = await signer.signMessage(originalMessage);

      return signedMessage;
    } catch (error: any) {
      throw error.message;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: 'eth_private_key',
      });

      return privateKey;
    } catch (error: any) {
      throw error.message;
    }
  }

  async getContract(address: string) {
    const signer = await this.ethersProvider.getSigner();
    const contract = new ethers.Contract(address, ThreePMabi, signer);
    return contract;
  }

  async getBalanceOf(address: string, tokenId: string) {
    const contract = this.getContract(address);
    const walletAddress = await this.getAccounts();
    const balance = await (contract as any).balanceOf(walletAddress, parseInt(tokenId));

    return balance;
  }
}
