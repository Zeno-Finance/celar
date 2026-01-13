import { JsonRpcProvider } from "ethers";

export type RouteCacheKey = `route:${string}-${string}-${string}`;

export interface CachedRouteEntry {
  candidates: RouteCandidate[];
  cachedAt: number; // timestamp (ms)
}

export interface ChainConfig {
  name?: Chain;
  priceFeedAddress: string;
  chainId: number;
  nativeToken: string;
  usdcAddress?: string;
  usdtAddress?: string;
  mneeAddress?: string;
  rpcUrl: string;
  // explorerUrl?: string;
  intermediaryWallet?: string;
  treasuryWallet: string;
  factory?: string;
}
export interface PendingPayment {
  id: string;
  chain: Chain;
  currency: string;
  amount: string;
  token_address: string;
  intermediary_wallet: string;
  created_block_number: number;
  status: "pending" | "confirmed"| "settling",
  psp_id: string;
}
export type ValidTokenSymbol = "USDC" | "USDT" | "MNEE";
export interface Payment {
  id: string;
  merchant_id: string;
  amount: string;
  currency: ValidTokenSymbol;
  chain: string;
  status: 'pending' | 'confirmed'| 'settled' | 'failed'| 'settled_failed' | 'settling';
  psp_wallet: string; 
  intermediary_wallet: string; 
  token_address: string;
  psp_id: string; 
}

export interface ChainAdapter {
    getEstimatedFee(amount: string, currency: ValidTokenSymbol): Promise<string>;
    getEstimatedTime(): Promise<number>;
    checkHealth(): Promise<number>;
    getProvider(): JsonRpcProvider;
    getConfig(): {
      usdcAddress?: string;
      usdtAddress?: string;
      mneeAddress?: string;
      priceFeedAddress: string;
      rpcUrl: string;
    };
  }

  export interface FeeSplit {
    total: string;
    treasury: string;
    psp: string;
    percent: number;
  }
  
  
export type Chain = 'base' | 'polygon' | 'arbitrum' | 'ethereum'
export type MismatchedPaymentStatus = "underpaid" | "overpaid" | "sorted";

export interface RouteCandidate {
  chain: Chain;
  estimatedFee: string; 
  token: string;   
  estimatedTime: number;  
  healthScore: number;  
  rankingScore: number;   
}

export interface RecordTxAttemptParams {
  paymentId: string;
  txHash?: string;
  chain: Chain;
  token: string;
  amount: string;
  target: "psp" | "treasury" | "incoming" | 'failed';
  attempt: number;
  success: boolean;
  error?: string;
  meta?: Record<string, any>;
}

export type PaymentSweepInput = {
  id: string;
  intermediary_wallet: string;
  token_address: string;
  chain: Chain;
  amount: string;
  psp_wallet: string;
};

export interface SettlementResult {
  txHash: string;
  pspAmount: string;
  treasuryAmount: string;
}


