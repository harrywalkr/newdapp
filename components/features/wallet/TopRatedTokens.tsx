'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { WalletSummaryType } from '@/types/wallet-summary.type';
import randomColor from 'randomcolor';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  walletSummary: WalletSummaryType;
}

const TopRatedTokens: React.FC<Props> = ({ walletSummary }) => {
  const processDataForPieChart = () => {
    const tokens = walletSummary!.Top20HotTokenHolders!.concat(walletSummary.HotTokenHolders);
    const totalBalance = tokens.reduce((sum, token) => sum + token.balance, 0);

    return tokens.map((token) => ({
      name: token.tokenName,
      value: token.balance,
      color: randomColor(),
      pnl: token.currentProfit,
      ratio: ((token.balance / totalBalance) * 100).toFixed(2) + '%',
    }));
  };

  return (
    <div className="flex items-start justify-start gap-10">
      <PieChart width={300} height={200}>
        <Pie
          data={processDataForPieChart()}
          label={({ name }) => name}
          dataKey="value"
          outerRadius={70}
          fontSize={14}
        >
          {processDataForPieChart().map((item, index: number) => (
            <Cell key={`cell-${index}`} fill={item.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trading Pair</TableHead>
            <TableHead>Ratio</TableHead>
            <TableHead>PnL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processDataForPieChart().map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.ratio}</TableCell>
              <TableCell>{item.pnl}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopRatedTokens;
