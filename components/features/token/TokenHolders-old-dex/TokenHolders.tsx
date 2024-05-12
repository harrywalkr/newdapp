import { useParams } from "next/navigation";
import TokenHoldersAmountFilter from "./TokenHoldersAmountFilter";
import TokenHoldersCompare from "./TokenHoldersCompare";
import TokenHoldersHolderStats from "./TokenHoldersHolderStats";
import TokenHoldersInterestScore from "./TokenHoldersInterestScore";
import TokenHoldersMostActiveAddress from "./TokenHoldersMostActiveAddress";
import { useEffect } from "react";
import { useRouter } from "@/providers/router-events";


export default function TokenHolders() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    const key = localStorage.getItem("KEY");
    if (!key) router.replace(`/login?redirect=token/${params!.params![0]}/${params!.params![1]}?tab=holders`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="flex flex-col gap-12 pt-8">
      <TokenHoldersHolderStats />
      <TokenHoldersAmountFilter />
      <TokenHoldersCompare />
      <TokenHoldersMostActiveAddress />
      <TokenHoldersInterestScore />
    </div>
  )
}
