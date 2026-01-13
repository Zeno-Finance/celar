import { JsonRpcProvider, Contract } from "ethers";
import { erc20Abi } from "viem";
import { SUPPORTED_CHAINS } from "../utils/chains.ts";
import type { ChainAdapter, ValidTokenSymbol } from "../utils/types.ts";
import { checkRpcHealth, estimateAvgBlockTime, estimateFeeUSD } from "./adapterUtils.ts";
import { DUMMY_TO } from "../utils/constants.ts";
import { getTokenForChain } from "./tokens.ts";

const provider = new JsonRpcProvider(SUPPORTED_CHAINS.polygon.rpcUrl);

export const polygonAdapter: ChainAdapter = {
  async getEstimatedFee(amount, currency: ValidTokenSymbol) {
    const cfg = SUPPORTED_CHAINS.polygon;

    const token = getTokenForChain("polygon", cfg, currency);

    const tokenContract = new Contract(token, erc20Abi, provider);
    const decimals: number = await tokenContract.decimals();

    return estimateFeeUSD({
      provider,
      tokenAddress: token,
      intermediaryWallet: cfg.intermediaryWallet ?? DUMMY_TO,
      priceFeedAddress: cfg.priceFeedAddress!,
      currencyDecimals: decimals,
      fallbackGasLimit: 60_000n
    });
  },

  getEstimatedTime() {
    return estimateAvgBlockTime(provider);
  },

  checkHealth() {
    return checkRpcHealth(provider);
  },

  getProvider(): JsonRpcProvider {
    return provider;
  },

  getConfig() {
    const cfg = SUPPORTED_CHAINS.polygon;
    return {
      usdcAddress: cfg.usdcAddress,
      usdtAddress: cfg.usdtAddress,
      priceFeedAddress: cfg.priceFeedAddress,
      rpcUrl: cfg.rpcUrl,
    };
  },
};

