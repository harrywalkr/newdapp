import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { WalletType } from "@/types/Wallet.type";
import { WalletSummaryType } from "@/types/wallet-summary.type";
import { WalletStatType } from "@/types/wallet-stat.type";
import formatDate, { getPastDate } from "@/utils/date";
import { WalletBalanceType } from "@/types/wallet-balance.type";
import { SwapType } from "@/types/swap.type";

export const getWallets = (options: AxiosRequestConfig): res<WalletType[]> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/valuable_wallets/`,
    options
  );
};

export const getWalletSummary = (data: {
  walletAddress: string;
  options: AxiosRequestConfig;
}): res<WalletSummaryType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/walletSummary/${data.walletAddress}`,
    data.options
  );
};

export const getWalletStat = (
  options: AxiosRequestConfig
): res<WalletStatType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/addressStats`,
    options
  );
};

export const getWalletSwaps = (
  options: AxiosRequestConfig
): res<SwapType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/api/swaps`,
    options
  );
};

export const getWalletBalance = (data: {
  walletAddress: string;
  options: AxiosRequestConfig;
}): res<WalletBalanceType> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/balance/${data.walletAddress}`,
    data.options
  );
};

export const getWalletParams = async (data: {
  walletAddress: string;
}): Promise<{
  limit?: number;
  from?: string;
  till?: string;
}> => {
  const { data: walletStat } = await getWalletStat({
    params: {
      address: data.walletAddress,
      network: "ethereum", //FIXME: network must come globally
    },
  });
  const sendTxCount =
    +walletStat.data.ethereum.addressStats[0].address.sendTxCount;
  const receiveTxCount =
    +walletStat.data.ethereum.addressStats[0].address.receiveTxCount;
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
