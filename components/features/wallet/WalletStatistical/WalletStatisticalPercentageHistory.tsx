import { minifyContract, minifyTokenName } from "@/utils/contract";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function WalletStatisticalPercentageHistory({ walletInfo }: any) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = walletInfo.percentageMonth;
    let years: string[] = [];
    Object.entries(data).forEach(([key]: any) => {
      const keyYear = key.split(" ")[1];
      years.push(keyYear);
    });
    // @ts-ignore
    years = [...new Set(years)];
    let dd: any[] = years.map((y: string) => ({
      index: y,
      data: months.map((m: any) => ({
        col: m,
        row: "-",
      })),
    }));
    Object.entries(data).forEach(([key, value]: any) => {
      const keyMonth = key.split(" ")[0];
      const keyYear = key.split(" ")[1];
      if (value !== "N/A")
        dd
          .find((d: any) => d.index === keyYear)
          .data.find((d: any) => d.col === keyMonth).row = value?.toFixed(2);
    });
    setHistory(dd as any);
  }, [walletInfo]);

  return (
    <div className="mt-5">
      <div className="overflow-x-auto">
        <table className="table table-pin-rows table-pin-cols bg-base-100 rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="text-center bg-base-content text-base-100">
                Year
              </th>
              {months.map((m: string) => (
                <th key={m} className="bg-base-content text-base-100">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((d: any, idx: number) => (
              <Record key={idx} idx={idx + 1} data={d} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Record = ({ data }: { data: any; idx: number }) => {
  return (
    <tr>
      <td className="text-center text-base-content">{data.index}</td>
      {data.data.map((d: any, idx: number) => {
        const value = parseFloat(d.row);
        return (
          <td
            key={idx}
            className="text-center text-base-content"
            style={{
              background: isNaN(value)
                ? ""
                : value > 0
                  ? `rgba(100, 255, 100, ${value > 10 ? value / 100 : '0.2'})`
                  : `rgba(255, 100, 100, ${Math.abs(value) > 10 ? Math.abs(value) / 100 : '0.2'})`,
            }}
          >
            {d.row !== "-" ? `${d.row}%` : `${d.row}`}
          </td>
        );
      })}
    </tr>
  );
};
