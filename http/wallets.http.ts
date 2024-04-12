import { res } from "@/types/http.type";
import axiosInstance from "./axios.config";
import { AxiosRequestConfig } from "axios";
import { WalletType } from "@/types/Wallet.type";

export const getWallets = (options: AxiosRequestConfig): res<WalletType[]> => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL_ONE}/valuable_wallets`,
    options
  );
};
