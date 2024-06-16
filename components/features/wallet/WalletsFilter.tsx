import { useMounted } from "@/utils/useMounted";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IWallet } from "@/types/Wallet.type";
import { FilterType, initTopWalletFilters } from "@/types/topwallet.type";
import { BiFilterAlt } from "react-icons/bi";
import Filter from "../homepage/Filter-old-dex";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import Search from "../homepage/Search-old-dex";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Prop {
  layout: any;
  setLayout: any;
  filters: { [key: string]: FilterType };
  setFilters: (filter: { [key: string]: FilterType }) => void;
  wallet: IWallet[];
  onSearch: (wallet: IWallet[]) => void;
}

export default function WalletsFilter({
  layout,
  setLayout,
  filters,
  setFilters,
  wallet,
  onSearch,
}: Prop) {
  const mounted = useMounted();
  const [layoutLocal, setLayoutLocal] = useState(layout);
  const [localFilter, setLocalFilters] = useState(filters);
  const [resetFilter, setResetFilter] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedFilter, setClickedFilter] = useState<string>("1");

  const handleApply = () => {
    setLayout(layoutLocal);
    setFilters(localFilter);
    setIsOpen(!isOpen)
  };

  const updateLocalFilter = (key: string, value: any) => {
    setLocalFilters({
      ...localFilter,
      [key]: {
        ...localFilter[key],
        value: value,
      },
    });
  };


  if (!mounted) return null;

  return (
    <>
      <div>
        <div className="flex items-center justify-start gap-6 mb-5">
          <Search wallet={wallet} onSearch={onSearch} />
          <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger className="">
              <div className="flex items-center justify-center gap-2">
                <BiFilterAlt />
                <span>
                  Filters
                </span>
              </div>
            </DialogTrigger>
            <DialogContent className="h-4/6 max-h-screen">
              <DialogHeader>
                <DialogTitle>Top Wallets Filters</DialogTitle>
                <DialogDescription>
                  Apply Filters to the top wallet and find out what makes them tick
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-full">
                <div className="mt-4">
                  {Object.keys(initTopWalletFilters).map((key: string) => (
                    <Filter
                      key={key}
                      filter={initTopWalletFilters[key]}
                      updateLocalFilters={updateLocalFilter}
                      resetFilter={resetFilter}
                    />
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-3 items-center justify-end mt-4">
                <Button
                  variant='outline'
                  onClick={() => {
                    setResetFilter(resetFilter + 1);
                    setLocalFilters(initTopWalletFilters);
                  }}
                >
                  <GrPowerReset />
                </Button>
                <Button
                  onClick={handleApply}
                >
                  Apply
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div >

      </div >
    </>
  );
}
