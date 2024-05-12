import CopyAddress from "@/utils/CopyAddress";
import { minifyContract } from "@/utils/contract";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";

export default function MostActiveAddress() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true)
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);
    const controller = new AbortController();
    fetch(
      `https://onchain.dextrading.com/TopTokenActiveTraders?limit=10&network=${
        params.params[0]
      }&address=${
        params.params[1]
      }&from=${from.toISOString()}&till=${to.toISOString()}`
    , { signal: controller.signal })
      .then((data) => data.json())
      .then((json) => setData(json.data.ethereum.smartContractCalls))
      .finally(() => setLoading(false));
      return () => {
        controller.abort();
      } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <span className="loading loading-bars loading-md"></span>
      </div>
    );

  return (
    <div className="xL:max-w-[1200px] xl:mx-auto xl:min-w-[1200px]">
      <h2 className="text-2xl font-bold mb-5 text-center sm:text-left">
        Most Active Addresses
      </h2>
      <Table data={data} />
    </div>
  );
}

function Table({ data }: { data: any[] }) {
  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="table table-pin-rows table-pin-cols bg-base-100 rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="text-center bg-base-content text-base-100 w-[300px]">
                Address
              </th>
              <th
                className="bg-base-content text-base-100"
                style={{ textAlign: "center" }}
              >
                Trades
              </th>
              <th
                className="bg-base-content text-base-100 text-center"
                style={{ textAlign: "center" }}
              >
                Gas Value
              </th>
              <th
                className="bg-base-content text-base-100 text-center"
                style={{ textAlign: "center" }}
              >
                Gas Value(USD)
              </th>
              <th
                className="bg-base-content text-base-100 text-center w-[200px]"
                style={{ textAlign: "center" }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d: any, idx: number) => (
              <Record key={d.id} idx={idx + 1} data={d} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Record = ({ data, idx }: { data: any; idx: number }) => {
  return (
    <tr>
      <td className="text-base-content">
        <div className="flex space-x-2 items-center">
          <span className="opacity-70">
            {minifyContract(data.address.address)}
          </span>
          <CopyAddress address={data.address.address} />
        </div>
      </td>
      <td
        className="text-base-content whitespace-nowrap"
        style={{ textAlign: "center" }}
      >
        {data.count} Trades
      </td>
      <td
        className="text-center text-base-content whitespace-nowrap"
        style={{ textAlign: "center" }}
      >
        {data.gasValue.toFixed(4)}
      </td>
      <td
        className="text-center text-base-content whitespace-nowrap"
        style={{ textAlign: "center" }}
      >
        ${data.gas_value_usd.toFixed(2)}
      </td>
      <td
        className="text-center text-base-content"
        style={{ textAlign: "center" }}
      >
        {data.max_date}
      </td>
    </tr>
  );
};
