'use client';
import React, { useState, useEffect } from 'react';
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
  const [processedData, setProcessedData] = useState<any[]>([]);

  useEffect(() => {
    const processDataForPieChart = () => {
      const top20Tokens = walletSummary?.Top20HotTokenHolders || [];
      const hotTokenHolders = walletSummary?.HotTokenHolders || [];
      const tokens = top20Tokens.concat(hotTokenHolders);
      console.log('hello', tokens);

      const totalBalance = tokens.reduce((sum, token) => sum + (token.currentValue || 0), 0);

      if (totalBalance === 0) {
        return tokens.map((token) => ({
          name: token.tokenName,
          value: token.currentValue,
          color: randomColor(),
          pnl: token.currentProfit,
          ratio: 0,
        }));
      }

      return tokens.map((token) => ({
        name: token.tokenName,
        value: token.currentValue,
        color: randomColor(),
        pnl: token.currentProfit,
        ratio: ((token.currentValue / totalBalance) * 100),
      }));
    };

    setProcessedData(processDataForPieChart());
  }, [walletSummary]);

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start  justify-start gap-10 ">
       <PieChart width={300} height={200} className='min-w-32'>
         <Pie
             data={processedData.filter(token => token.value !== 0)}
             label={({ name }) => name}
             dataKey="value"
             outerRadius={70}
             fontSize={14}
         >
           {processedData.map((item, index: number) => (
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
          {processedData.sort((a, b) => b.ratio - a.ratio).map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium flex items-center justify-start gap-1">
                <div style={{ backgroundColor: item.color, width: 5, height: 5 }} />
                {item.name}
              </TableCell>
              <TableCell>{item.ratio.toFixed(2) + '%'}</TableCell>
              <TableCell>{item.pnl.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopRatedTokens;
