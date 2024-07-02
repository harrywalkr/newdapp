'use client'

import { useEffect, useState } from "react";
import { PaymentType } from "./schema";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { IWallet } from "@/types/Wallet.type";



interface Props {
  initTopWallets: IWallet[];
}

export default function TableExample({ initTopWallets }: Props) {
  return <DataTable data={initTopWallets} />;
}
