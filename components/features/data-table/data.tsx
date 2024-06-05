'use client'

import { useEffect, useState } from "react";
import { PaymentType } from "./schema";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { IWallet} from "@/types/Wallet.type";

async function getData(): Promise<PaymentType[]> {
  const res = await fetch(
    "https://my.api.mockaroo.com/payment_info.json?key=f0933e60"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

interface Props {
  initTopWallets: WalletType[];
}

export default function TableExample({initTopWallets}: Props) {
  return <DataTable columns={columns} data={initTopWallets} />;
}
