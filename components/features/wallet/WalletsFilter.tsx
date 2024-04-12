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
import { WalletType } from "@/types/Wallet.type";
import { FilterType } from "@/types/topwallet.type";
import { BiFilterAlt } from "react-icons/bi";

interface Prop {
  layout: any;
  setLayout: any;
  filters: { [key: string]: FilterType };
  setFilters: (filter: { [key: string]: FilterType }) => void;
  wallet: WalletType[];
  onSearch: (wallet: WalletType[]) => void;
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
  const [clickedFilter, setClickedFilter] = useState<string>("1");

  const handleApply = () => {
    setLayout(layoutLocal);
    setFilters(localFilter);
    if (typeof window !== "undefined") {
      (document.getElementById("top-wallets-filter")! as any).close();
    }
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

  // const items = [
  //   {
  //     key: "1",
  //     label: "Columns",
  //     children: (
  //       <div className="text-xl mt-10 ">
  //         {/* <DragDropContextComponent setLayout={setLayoutLocal} /> */}
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "2",
  //     label: "Filters",
  //     default: true,
  //     children: (
  //       <div className="text-xl mt-10 flex flex-col gap-3 max-h-[50vh] overflow-y-scroll">
  //         {Object.keys(initTopWalletFilters).map((key: string) => (
  //           <Filter
  //             filter={initTopWalletFilters[key]}
  //             updateLocalFilters={updateLocalFilter}
  //             resetFilter={resetFilter}
  //           />
  //         ))}
  //       </div>
  //     ),
  //   },
  // ];

  if (!mounted) return null;

  return (
    <>
      <div>
        <div className="flex items-center justify-center gap-6 md:border-r md:border-r-gray-400  bg-base-100">
          {/* <Search wallet={wallet} onSearch={onSearch} /> */}
        </div >
        <Dialog>
          <DialogTrigger className="mb-5 h-9 px-4 py-2 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <div className="flex items-center justify-center gap-2">
              <BiFilterAlt />
              <span>
                Filters
              </span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>column and filter setting</DialogTitle>
              <DialogDescription>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam, iure aliquam? Molestias reprehenderit atque non illum ratione dolore maxime eius doloremque hic quis doloribus earum dolorum mollitia, iste sunt architecto?
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div >



      {/* <div className="flex flex-col gap-3 items-start justify-start mb-3 md:mb-5 md:flex-row md:gap-14 md:items-center ">
        <div className="flex items-center justify-center gap-6 md:border-r md:border-r-gray-400  bg-base-100">
          <Search wallet={wallet} onSearch={onSearch} />
        </div >
        <button
          className="flex items-center justify-center gap-6 md:border-r md:border-r-gray-400 pr-14  bg-base-100 "
          onClick={() => {
            setClickedFilter("1");
            if (typeof window !== "undefined") {
              (document.getElementById("top-wallets-filter")! as any).showModal();
            }
          }}
        >
          <TbColumns3 />
          <span>Columns</span>
        </button>
        <button
          className="flex items-center justify-center gap-6 bg-base-100"
          onClick={() => {
            setClickedFilter("2");
            if (typeof window !== "undefined") {
              (document.getElementById("top-wallets-filter")! as any).showModal();
            }
          }}
        >
          <FaFilter />
          <span className="">Filters</span>
        </button>
      </div >
      <dialog
        id="top-wallets-filter"
        className="modal sm:modal-middle p-2 transition duration-500 max-h-screen "
      >
        <div className=" max-w-[585px] w-full rounded-lg p-2 md:p-8 transition duration-500 max-h-[95vh] overflow-y-scroll bg-foreground6">
          <div className="header flex items-center justify-between ">
            <p>Drag and drop desired columns to the right</p>
            <IoClose
              size={25}
              className="cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined") {
                  (document.getElementById("top-wallets-filter")! as any).close()
                }
              }
              }
            />
          </div>
          <div className="body">
            <Tabs
              tabPosition="top"
              items={items}
              defaultActiveKey="1"
              activeKey={clickedFilter}
              className="w-full mx-auto border-none mt-9 gap-44"
              style={{ border: "none", gap: "0" }}
              onChange={setClickedFilter}
            />

            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">Make changes to your account here.</TabsContent>
              <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>


          </div>
          <div className="flex gap-3 items-center justify-end mt-4">
            <Button
              onClick={() => {
                setResetFilter(resetFilter + 1);
                setLocalFilters(initTopWalletFilters);
              }}
            >
              <GrPowerReset />
            </Button>
            <button
              className="bg-foreground5 py-2 px-8 rounded-md"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </dialog > */}
    </>
  );
}
