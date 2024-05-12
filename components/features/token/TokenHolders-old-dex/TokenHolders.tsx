import TokenHoldersAmountFilter from "./TokenHoldersAmountFilter";
import TokenHoldersCompare from "./TokenHoldersCompare";
import TokenHoldersHolderStats from "./TokenHoldersHolderStats";
import TokenHoldersInterestScore from "./TokenHoldersInterestScore";
import TokenHoldersMostActiveAddress from "./TokenHoldersMostActiveAddress";


export default function TokenHolders() {

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
