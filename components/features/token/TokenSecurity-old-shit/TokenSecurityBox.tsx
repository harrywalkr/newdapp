'use client';
import { useTokenChainStore } from '@/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SourceCodeControl {
  is_open_source: string | null;
  isProxy: string | null;
  externalCall: string | null;
  isHoneypot: string | null;
  honeypot_with_same_creator: string | null;
  isMintable: string | null;
}

interface Restriction {
  isBlacklisted: string | null;
  isWhitelisted: string | null;
  isAntiWhale: string | null;
}

interface TradingControl {
  cannotBuy: string | null;
  cannotSellAll: string | null;
  tradingCooldown: string | null;
  transfer_pausable: string | null;
}

interface OwnershipControl {
  hiddenOwner: string | null;
  canTakeBackOwnership: string | null;
  personalSlippageModifiable: string | null;
  ownerChangeBalance: string | null;
}

interface TaxControl {
  personalSlippageModifiable: string | null;
  slippage_modifiable: string | null;
  gas_abuse: string | null;
}

interface TokenSecurityData {
  sourceCodeControl: SourceCodeControl;
  restriction: Restriction;
  tradingControl: TradingControl;
  ownershipControl: OwnershipControl;
  taxControl: TaxControl;
}

interface Props {
  tokenAddress: string;
}

const Record = ({
  title,
  color,
  transparent,
}: {
  title: string;
  color: 'bg-success/70' | 'bg-error/70';
  transparent: 'openSource' | 'proxy' | null;
}) => (
  <div
    className={`p-4 rounded-sm min-w-[110px] w-[110px] h-[80px] ${transparent === 'proxy'
      ? 'bg-error-content/30'
      : transparent === 'openSource'
        ? 'bg-base-content/50'
        : color
      } flex items-center justify-center`}
  >
    <span
      className={`text-center text-xs ${transparent === 'proxy'
        ? 'text-base-content/70'
        : transparent === 'openSource'
          ? 'text-base-content/80'
          : 'text-base-content/80'
        }`}
    >
      {title}
    </span>
  </div>
);

export default function TokenSecurityBox({ tokenAddress }: Props) {
  const params = useParams();
  const [data, setData] = useState<TokenSecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBoxTransparent, setIsBoxTransparent] = useState<'openSource' | 'proxy' | null>(null);
  const { selectedChain } = useTokenChainStore();

  useEffect(() => {
    fetch(
      `https://onchain.dextrading.com/security-data?chainId=${selectedChain.symbol}&baseCurrency=${tokenAddress}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          setData(null);
        } else {
          setData(json.tokenSecurity);
          setIsBoxTransparent(
            json.tokenSecurity.sourceCodeControl.is_open_source === 'no'
              ? 'openSource'
              : json.tokenSecurity.sourceCodeControl.isProxy === 'yes'
                ? 'proxy'
                : null
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching security data:', error);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [selectedChain.symbol, tokenAddress]);

  if (loading)
    return (
      <div className="w-full h-[700px] flex justify-center items-center">
        <span className="loading loading-bars loading-md"></span>
      </div>
    );

  if (!data) return null;

  const renderRecords = (title: string, records: any | Record<string, string | null>) => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5 overflow-x-auto">
        <div className="font-medium min-w-[160px] w-[160px]">{title}</div>
        {Object.entries(records).map(([key, value]) => (
          <Record
            key={key}
            title={key}
            transparent={isBoxTransparent}
            color={value !== 'no' ? 'bg-error/70' : 'bg-success/70'}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`py-4 px-4 lg:px-16 rounded-md ${data.sourceCodeControl.is_open_source === 'no'
        ? 'bg-base-content/30'
        : data.sourceCodeControl.isProxy === 'yes'
          ? 'bg-error/50'
          : 'bg-base-content/10'
        }`}
    >
      <h2 className="mb-8 mt-4 text-center flex flex-col gap-2">
        <span className="text-xl font-semibold">Security Box</span>
        <span className="text-lg font-medium text-base-content/80">
          {data.sourceCodeControl.is_open_source === 'no'
            ? 'Contract is not Safe'
            : data.sourceCodeControl.isProxy === 'yes'
              ? 'Contract Proxy'
              : ''}
        </span>
      </h2>
      <div className="flex flex-col gap-5">
        {renderRecords('Source Code Control', data.sourceCodeControl)}
        {renderRecords('Restriction', data.restriction)}
        {renderRecords('Trading Control', data.tradingControl)}
        {renderRecords('Ownership Control', data.ownershipControl)}
        {renderRecords('Tax Control', data.taxControl)}
      </div>
    </div>
  );
}
