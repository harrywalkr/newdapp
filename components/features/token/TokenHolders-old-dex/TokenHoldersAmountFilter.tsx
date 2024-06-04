import { minifyContract } from "@/utils/truncate";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";

interface Holder {
  Holder: {
    Address: string;
  };
}

interface FormState {
  from: number;
  to: number;
}

interface Props {
  tokenAddress: string
}

const fetchTokenHolders = async (network: string, id: string, from: number, to: number) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 6);
  const response = await fetch(
    `https://onchain.dextrading.com/rangeholders?network=${network}&till=${toDate.toISOString().split("T")[0]}&limit=20&token=${id}&minAmount=${from}&maxAmount=${to}`
  );
  const data = await response.json();
  return data.data.EVM.TokenHolders;
};

export default function TokenHolders({ tokenAddress }: Props) {
  const [form, setForm] = useState<FormState>({ from: 0, to: 1000000 });
  const [showMore, setShowMore] = useState(true);

  const { data, isLoading, error } = useQuery(
    {
      queryKey:
        ['tokenHolders', tokenAddress, form.from, form.to],
      queryFn:
        () => fetchTokenHolders('eth', tokenAddress, form.from, form.to),
    }
  );

  const handleSelectChange = (key: keyof FormState) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [key]: parseInt(event.target.value) });
  };

  return (
    <div className="relative xl:max-w-[1200px] xl:mx-auto xl:min-w-[1200px] border border-base-content/50 rounded-lg p-4 pb-16 overflow-hidden">
      <h2 className="text-2xl font-bold text-center sm:text-left">Amount Filter</h2>
      <div className="flex items-center gap-3 lg:pl-[60px] flex-wrap sm:flex-nowrap mb-5">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">From</span>
          </div>
          <select className="w-full select select-bordered" value={form.from} onChange={handleSelectChange("from")}>
            <option value={0}>{"<1K"}</option>
            <option value={2000}>2K</option>
            <option value={3000}>3K</option>
            <option value={5000}>5K</option>
            <option value={10000}>10K</option>
            <option value={100000}>100K</option>
            <option value={1000000}>1M</option>
          </select>
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">To</span>
          </div>
          <select className="w-full select select-bordered" value={form.to} onChange={handleSelectChange("to")}>
            <option value={0}>{"<1K"}</option>
            <option value={2000}>2K</option>
            <option value={3000}>3K</option>
            <option value={5000}>5K</option>
            <option value={10000}>10K</option>
            <option value={100000}>100K</option>
            <option value={1000000}>1M</option>
          </select>
        </label>
      </div>
      {isLoading ? (
        <div className="w-full flex justify-center items-center h-[150px]">
          loading ...
        </div>
      ) : error ? (
        <div className="w-full flex justify-center items-center h-[150px]">
          <span>Error loading token holders</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 items-start justify-start xl:hidden gap-3 lg:pl-[60px]">
            {data && (showMore ? data : data.slice(0, 10)).map((data: any, id: number) => (
              <div key={id} className="">
                <Addresses key={id} value={id} address={data.Holder.Address} haveLine={id !== data.length - 1} />
              </div>
            ))}
          </div>
          <div className="xl:grid hidden grid-cols-2 gap-3 lg:pl-[60px]">
            {data && (showMore ? data : data.slice(0, 10)).map((data: any, id: number) => (
              <Addresses key={id} value={id} address={data.Holder.Address} haveLine={id !== data.length - 1 && id !== data.length - 2} />
            ))}
          </div>
        </>
      )}
      {data && data.length > 10 && (
        <div className="absolute flex justify-center items-center w-full bg-gradient-to-t from-base-300 to-base-300/50 py-4" style={{ bottom: "-10px", left: 0, right: 0 }}>
          <button onClick={() => setShowMore(!showMore)} className="btn btn-neutral btn-block lg:btn-wide btn-sm self-center">
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

const Addresses = ({ value, address, haveLine }: { value: number; address: string; haveLine: boolean }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAddress = (text: string) => () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="relative flex items-start justify-start gap-2">
      {haveLine && <div className="absolute w-[1px] h-[22px] /70 left-[66px] top-[20px] hidden sm:block"></div>}
      <div className="w-[50px]">{value + 1}</div>
      <div className="rounded-full /70 p-[8px] z-10"></div>
      <div className="flex items-center gap-2">
        <span className="text-base-content/80 hidden sm:block">{address}</span>
        <span className="text-base-content/80 text-lg block sm:hidden">{minifyContract(address)}</span>
        <div className="tooltip tooltip-right" data-tip={copied ? "Copied" : "Copy Address"}>
          <FiCopy onClick={handleCopyAddress(address)} className="cursor-pointer text-lg" />
        </div>
      </div>
    </div>
  );
};
