import { evaluateBestRoute } from "./routeScorer.ts";
import { ADAPTER_REGISTRY } from "./adapters/index.ts";
import type { Chain, ValidTokenSymbol } from "./utils/types.ts";
import { generateKernelWallet } from "./smartwallet/settleSmartWallet.ts";
import { findCachedRoute } from "./routeCache.ts";
import { CustomError } from "./utils/utils.ts";
import { getTokenForChain } from "./adapters/tokens.ts";

export async function resolveRouteForPayment(
  paymentId: string,
  amount: string,
  currency: ValidTokenSymbol,
  chain: string
): Promise<{
  resolvedChain: Chain;
  tokenAddress: string;
  intermediaryWallet: string;
  estimatedFee: string;
  estimatedTime: number;
  healthScore?: number;
  rankingScore?: number;
}> {
  let resolvedChain: Chain;
  let tokenAddress: string;
  let estimatedFee: string;
  let estimatedTime: number;
  let healthScore: number | undefined;
  let rankingScore: number | undefined;

  if (chain === "best") {
    const candidates = await evaluateBestRoute(amount, currency);

    if (!candidates || candidates.length === 0) {
      throw new CustomError({
        message: `No eligible routes found for ${currency} at amount ${amount}`,
        statusCode: 400,
      });
    }

    const bestRoute = candidates[0];

    resolvedChain = bestRoute.chain;
    tokenAddress = bestRoute.token;
    estimatedFee = bestRoute.estimatedFee;
    estimatedTime = bestRoute.estimatedTime;
    healthScore = bestRoute.healthScore;
    rankingScore = bestRoute.rankingScore;

    console.log(`[ROUTE] Best route selected:`, {
      resolvedChain,
      tokenAddress,
      estimatedFee,
      estimatedTime,
      healthScore,
      rankingScore,
    });
  } else {
    resolvedChain = chain as Chain;

    // 1) try cache
    const cached = await findCachedRoute(resolvedChain, currency, amount);
    if (cached && cached.length > 0) {
      const route = cached[0];
      tokenAddress = route.token;
      estimatedFee = route.estimatedFee;
      estimatedTime = route.estimatedTime;
      healthScore = route.healthScore;
      rankingScore = route.rankingScore;
    } else {
      console.log(
        `[ROUTE] Cache miss. Estimating route for static chain: ${resolvedChain}`
      );

      const adapter = ADAPTER_REGISTRY[resolvedChain];
      const cfg = adapter.getConfig();

      tokenAddress = getTokenForChain(resolvedChain, cfg, currency);
      estimatedFee = await adapter.getEstimatedFee(amount, currency);
      estimatedTime = await adapter.getEstimatedTime();
    }
  }

  const intermediaryWallet = await generateKernelWallet(paymentId, resolvedChain);
  console.log(`[ROUTE] Generated Kernel smart wallet: ${intermediaryWallet}`);

  return {
    resolvedChain,
    tokenAddress,
    intermediaryWallet,
    estimatedFee,
    estimatedTime,
    healthScore,
    rankingScore,
  };
}
