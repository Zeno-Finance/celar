import { ethers } from "ethers";
import { CustomError } from "../utils/utils.ts";
import type { ValidTokenSymbol } from "../utils/types.ts";

type MinimalChainCfg = {
  usdcAddress?: string;
  usdtAddress?: string;
  mneeAddress?: string;
};

export function getTokenForChain(
  chainKey: string,
  cfg: MinimalChainCfg,
  currency: ValidTokenSymbol
): string {
  if (currency === "MNEE" && chainKey !== "ethereum") {
    throw new CustomError({
      message: "MNEE currency can only be used on Ethereum",
      statusCode: 400,
    });
  }

  let token: string | undefined;
  if (currency === "USDC") token = cfg.usdcAddress;
  if (currency === "USDT") token = cfg.usdtAddress;
  if (currency === "MNEE") token = cfg.mneeAddress;

  if (!token) {
    throw new CustomError({
      message: `Token ${currency} is not configured for chain ${chainKey}`,
      statusCode: 400,
    });
  }

  const trimmed = token.trim();

  if (!ethers.isAddress(trimmed)) {
    throw new CustomError({
      message: `Invalid token address for ${chainKey} ${currency}: "${token}"`,
      statusCode: 400,
    });
  }

  return ethers.getAddress(trimmed.toLowerCase());
}
