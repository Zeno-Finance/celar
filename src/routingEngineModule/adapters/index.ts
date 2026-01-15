import type { ChainAdapter, Chain } from "../utils/types.ts";
import { baseAdapter } from "./baseAdaptor.ts";
import { arbitrumAdapter } from "./arbitrumAdaptor.ts";
import { ethereumAdapter } from "./ethereum.ts";

/**
 * Registry of all available chain adapters keyed by Chain.
 */
export const ADAPTER_REGISTRY: Record<Chain, ChainAdapter> = {
  base: baseAdapter,
  arbitrum: arbitrumAdapter,
  ethereum: ethereumAdapter,
};

export function getChainAdapter(chain: Chain): ChainAdapter {
  switch (chain) {
    case "base":
      return baseAdapter;
      case "arbitrum":
        return arbitrumAdapter;
      case "ethereum":
        return ethereumAdapter;
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}