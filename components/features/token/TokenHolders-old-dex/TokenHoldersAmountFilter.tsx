import { minifyContract } from "@/utils/truncate";
import { useParams } from "next/navigation";
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

export default function TokenHolders() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Holder[]>([]);
  const [form, setForm] = useState<FormState>({ from: 0, to: 1000000 });
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);

    fetch(
      `https://onchain.dextrading.com/rangeholders?network=eth&till=${to.toISOString().split("T")[0]}&limit=20&token=${params.id}&minAmount=${form.from}&maxAmount=${form.to}`,
    )
      .then((response) => response.json())
      .then((json) => setData(json.data.EVM.TokenHolders))
      .catch((error) => console.error("Error fetching token holders:", error))
      .finally(() => setLoading(false));
  }, [form.from, form.to, params.id]);

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
      {loading ? (
        <div className="w-full flex justify-center items-center h-[150px]">
          <span className="loading loading-bars loading-md"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:hidden gap-3 lg:pl-[60px]">
            {(showMore ? data : data.slice(0, 10)).map((d, idx, arr) => (
              <Addresses key={idx} value={idx} address={d.Holder.Address} haveLine={idx !== arr.length - 1} />
            ))}
          </div>
          <div className="xl:grid hidden grid-cols-2 gap-3 lg:pl-[60px]">
            {(showMore ? data : data.slice(0, 10)).map((d, idx, arr) => (
              <Addresses
                key={idx}
                value={idx}
                address={d.Holder.Address}
                haveLine={idx !== arr.length - 1 && idx !== arr.length - 2}
              />
            ))}
          </div>
        </>
      )}
      {data.length > 10 && (
        <div
          className="absolute flex justify-center items-center w-full bg-gradient-to-t from-base-300 to-base-300/50 py-4"
          style={{ bottom: "-10px", left: 0, right: 0 }}
        >
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
    <div className="relative flex items-center gap-2">
      {haveLine && <div className="absolute w-[1px] h-[22px] bg-base-content/70 left-[66px] top-[20px] hidden sm:block"></div>}
      <div className="w-[50px] text-right">{value + 1}</div>
      <div className="rounded-full bg-base-content/70 p-[8px] z-10"></div>
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
