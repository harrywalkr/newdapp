export default function PriceFormatter({
  value,
  dollarSign,
}: {
  value: number | string;
  dollarSign?: boolean;
}) {
  const v = typeof value === "string" ? +value : value;
  const vv = -Math.floor(Math.log(v) / Math.log(10) + 1);
  const vvv = v.toExponential();

  if (!v)
    return (
      <div className="flex items-center gap-[2px]">{dollarSign && "$"}0</div>
    );

  if (v > 0.0001) {
    return (
      <div className="flex items-center gap-[2px]">
        {dollarSign && "$"}
        {value.toString().split(".")[0]}.
        {value.toString().split(".")[1]?.slice(0, 8)}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-[2px]">
      {dollarSign && "$"}
      <span>0.0</span>
      <sub>{vv}</sub>
      <span>{vvv.toString().slice(0, 4).replace(".", "").split("e")[0]}</span>
    </div>
  );
}
