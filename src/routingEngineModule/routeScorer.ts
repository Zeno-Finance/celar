import type { Chain, RouteCandidate, ValidTokenSymbol } from "./utils/types.ts";
import { ADAPTER_REGISTRY } from "./adapters/index.ts";
import { findCachedRoute, saveRouteToCache } from "./routeCache.ts";
import { getTokenForChain } from "./adapters/tokens.ts";

export async function evaluateBestRoute(
  amount: string,
  currency: ValidTokenSymbol,
  chains?: Chain[]
): Promise<RouteCandidate[]> {
  const toCheck = chains ?? (Object.keys(ADAPTER_REGISTRY) as Chain[]);
  const candidates: RouteCandidate[] = [];

  for (const chain of toCheck) {
    // 1) cache
    const cached = await findCachedRoute(chain, currency, amount);
    if (cached && cached.length > 0) {
      candidates.push(...cached);
      continue;
    }

    // 2) compute
    const adapter = ADAPTER_REGISTRY[chain];
    const cfg = adapter.getConfig();

    let token: string;
    try {
      token = getTokenForChain(chain, cfg, currency);
    } catch {
      continue;
    }

    const [feeStr, time, health] = await Promise.all([
      adapter.getEstimatedFee(amount, currency),
      adapter.getEstimatedTime(),
      adapter.checkHealth(),
    ]);

    const fee = parseFloat(feeStr);
    const rankingScore = health * 2 - fee * 100 - time * 5;

    const route: RouteCandidate = {
      chain,
      token,
      estimatedFee: feeStr,
      estimatedTime: time,
      healthScore: health,
      rankingScore,
    };

    candidates.push(route);
    await saveRouteToCache(chain, currency, amount, [route]);
  }

  candidates.sort((a, b) => b.rankingScore - a.rankingScore);
  return candidates;
}
