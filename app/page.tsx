"use client";
import { NFT } from "@/components/features/homepage/NFT";
import Tokens from "@/components/features/homepage/Tokens";
import Wallet from "@/components/features/homepage/Wallet";

import { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

export default function Home() {
  return (
    <main className="flex flex-col gap-11 md:gap-11">
      <Tokens />
      <Wallet />
      <NFT columns={columns} data={payments} />
    </main>
  );
}
