'use client';
import { useTokenChainStore } from '@/store';
import { separate3digits } from '@/utils/numbers';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGasPump } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';

interface Props {
  tokenAddress: string;
}

interface SmartContractCall {
  internal_count: number;
  external_count: number;
  type: string;
  smartContractMethod: {
    name: string;
  };
  max_date: string;
  gas_value_usd: number;
}

const Record = ({ data, idx }: { data: SmartContractCall; idx: number }) => {
  const internal = data.internal_count;
  const external = data.external_count;
  const sum = internal + external;

  return (
    <tr>
      <td className="text-base-content">
        <div className="flex justify-center items-center">
          <div className="bg-base-content/40 p-2 rounded-md text-base-100 w-[100px] text-center">
            {data.type}
          </div>
        </div>
      </td>
      <td className="text-base-content">
        <div className="flex justify-center items-center">
          <div className="bg-base-content/40 p-2 rounded-md text-base-100 min-w-[100px] text-center">
            {data.smartContractMethod.name}
          </div>
        </div>
      </td>
      <td className="text-base-content">
        <div className="flex flex-col gap-3 py-2">
          <div className="flex gap-2">
            <div>Internal</div>
            <div
              className="bg-base-content/80 p-2 rounded-md h-4"
              style={{ width: `${(internal / sum) * 100}%` }}
            ></div>
            <div className="whitespace-nowrap">{internal} times</div>
          </div>
          <div className="flex gap-2">
            <div>External</div>
            <div
              className="bg-base-content/40 p-2 rounded-md h-4"
              style={{ width: `${(external / sum) * 100}%` }}
            ></div>
            <div className="whitespace-nowrap">{external} times</div>
          </div>
        </div>
      </td>
      <td className="text-base-content">
        <div className="flex flex-col gap-2 justify-center pl-4">
          <div className="flex items-center gap-1">
            <MdOutlineDateRange />
            <div className="text-base-content/70">{data.max_date}</div>
          </div>
          <div className="flex items-center gap-1">
            <FaGasPump className="text-base-content/70" />
            <div className="text-base-content/70">{separate3digits(data.gas_value_usd.toFixed(2))}$</div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default function TokenSecurityCallActivity({ tokenAddress }: Props) {
  const params = useParams();
  const [data, setData] = useState<SmartContractCall[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedChain } = useTokenChainStore();

  useEffect(() => {
    const controller = new AbortController();
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);

    fetch(
      `https://onchain.dextrading.com/functionTypeCalls?limit=100&network=${selectedChain.symbol}&address=${tokenAddress}&from=2018-01-14&till=${to.toISOString()}`,
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json.data?.ethereum?.smartContractCalls ?? []);
      })
      .catch((error) => {
        console.error('Error fetching call activity data:', error);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedChain.symbol, tokenAddress]);

  if (loading)
    return (
      <div className="w-full h-[350px] flex justify-center items-center">
        <span className="loading loading-bars loading-md"></span>
      </div>
    );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Smart Contract Call Activity</h2>
      <div className="overflow-x-auto">
        <table className="table table-pin-rows table-pin-cols bg-base-100 rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="bg-base-content text-base-100 w-[200px]">
                <div className="flex justify-center items-center">Type</div>
              </th>
              <th className="bg-base-content text-base-100 w-[200px]">
                <div className="flex justify-center items-center">Call Activity</div>
              </th>
              <th className="bg-base-content text-base-100 min-w-[500px]">
                <div className="flex justify-center items-center">Distribution</div>
              </th>
              <th className="bg-base-content text-base-100 min-w-[200px] w-[200px]">
                <div className="flex justify-center items-center">Detail</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <Record key={idx} idx={idx + 1} data={d} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}