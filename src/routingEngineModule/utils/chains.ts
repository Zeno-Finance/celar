import { Chain, ChainConfig } from "./types.ts";
import dotenv from 'dotenv';
dotenv.config();

function mustGetEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SUPPORTED_CHAINS: Record<Chain, ChainConfig> = {
  base: {
    // chainId: 8453,
    chainId: 84532, // Base testnet
    nativeToken: 'ETH',
    usdcAddress: mustGetEnv('BASE_USDC_ADDRESS'),
    usdtAddress: mustGetEnv('BASE_USDT_ADDRESS'),
    priceFeedAddress: mustGetEnv('BASE_CHAILINK_ADDRESS'),
    rpcUrl: mustGetEnv('BASE_RPC_URL'),
    treasuryWallet: mustGetEnv('TREASURY_WALLET'),
  },
arbitrum: {
  // chainId: 137,
  chainId: 421614, // testnet
  nativeToken: 'ETH',
  usdcAddress: mustGetEnv('ARB_USDC_ADDRESS'),
  usdtAddress: mustGetEnv('ARB_USDT_ADDRESS'),
  priceFeedAddress: mustGetEnv('ARB_CHAILINK_ADDRESS'),
  rpcUrl: mustGetEnv('ARB_RPC_URL'),
  treasuryWallet: mustGetEnv('TREASURY_WALLET'),
},
ethereum: {
  chainId: 1, // mainnet
  nativeToken: 'ETH',
  mneeAddress: mustGetEnv('ETH_MNEE_ADDRESS'),
  priceFeedAddress: mustGetEnv('ETH_CHAILINK_ADDRESS'),
  rpcUrl: mustGetEnv('ETH_RPC_URL'),
  treasuryWallet: mustGetEnv('TREASURY_WALLET'),
}
};
