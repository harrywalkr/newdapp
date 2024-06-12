import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { WalletSummaryType } from "@/types/wallet-summary.type";
import { WalletStatType } from "@/types/wallet-stat.type";
import { WalletBalanceType } from "@/types/wallet-balance.type";
import { SwapType } from "@/types/swap.type";
import formatDate, { getPastDate } from "@/utils/date";
import { IWallet } from "@/types/Wallet.type";

export const getWallets = (options?: AxiosRequestConfig): Promise<IWallet[]> =>
  fetchData<IWallet[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/valuable_wallets/`,
    {
      ...options,
      headers: {
        ...options?.headers,
        "Cache-Control": "no-store", 
      },
    }
  );

export const getWalletSummary = (
  walletAddress: string,
  options?: AxiosRequestConfig
): Promise<WalletSummaryType> =>
  fetchData<WalletSummaryType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/walletSummary/${walletAddress}`,
    options
  );

export const getWalletStat = (
  options?: AxiosRequestConfig
): Promise<WalletStatType> =>
  fetchData<WalletStatType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/addressStats`,
    options
  );

export const getWalletSwaps = (
  options: AxiosRequestConfig
): Promise<SwapType> =>
  fetchData<SwapType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/api/swaps`,
    options
  );

export const getWalletBalance = (
  walletAddress: string,
  options?: AxiosRequestConfig
): Promise<WalletBalanceType> =>
  fetchData<WalletBalanceType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/balance/${walletAddress}`,
    options
  );

export const getWalletParams = async (
  walletAddress: string
): Promise<{
  limit?: number;
  from?: string;
  till?: string;
}> => {
  const { data: walletStat } = await getWalletStat({
    params: {
      address: walletAddress,
      network: "ethereum", // FIXME: network must come globally
    },
  });

  const sendTxCount = +walletStat.ethereum.addressStats[0].address.sendTxCount;
  const receiveTxCount =
    +walletStat.ethereum.addressStats[0].address.receiveTxCount;

  if (
    4000 < sendTxCount + receiveTxCount &&
    sendTxCount + receiveTxCount < 12000
  ) {
    return {
      limit: 100000,
      from: formatDate(getPastDate(3), "dash"),
      till: formatDate(undefined, "dash"),
    };
  } else if (12000 < sendTxCount + receiveTxCount) {
    return {
      limit: 100000,
      from: formatDate(getPastDate(3), "dash"),
      till: formatDate(undefined, "dash"),
    };
  } else {
    return {};
  }
};
