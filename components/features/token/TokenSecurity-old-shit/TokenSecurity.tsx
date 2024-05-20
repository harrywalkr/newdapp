import TokenSecurityCallActivity from "./TokenSecurityCallActivity";
import TokenSecurityBox from "./TokenSecurityBox";
import TokenSecurityMeasureLine from "./TokenSecurityMeasureLine";
import { TokenType } from "@/types/token.type";


interface Props {
  token: TokenType
  tokenAddress: string
}

export default function TokenSecurityOldShit({ token, tokenAddress }: Props) {
  return (
    <div className="flex flex-col gap-16 mt-5">
      <TokenSecurityMeasureLine token={token} />
      <TokenSecurityBox tokenAddress={tokenAddress} />
      <TokenSecurityCallActivity tokenAddress={tokenAddress} />
    </div>
  );
}
