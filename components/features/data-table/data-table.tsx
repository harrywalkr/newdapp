import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { HotTokenHolder, IWallet } from "@/types/Wallet.type"
import Link from "next/link"
import Copy from "@/components/ui/copy"
import { minifyContract } from "@/utils/truncate"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icon"
import useWatchlistStore, { IWatchlistItem } from "@/store/watchlist"
import { useState } from "react"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { useTokenChainStore } from "@/store"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


interface DataTableProps<TData> {
  data: TData[]
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const [rowSelection, setRowSelection] = useState({})
  const { selectedChain } = useTokenChainStore();


  const handleStarClick = (wallet: IWatchlistItem) => {
    const isInWatchlist = watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.name);
    if (isInWatchlist) {
      removeFromWatchlist(wallet.name);
    } else {
      addToWatchlist({ name: wallet.contractAddress, contractAddress: wallet.contractAddress, type: 'wallet' });
    }
  };

  const isTokenInWatchlist = (wallet: IWatchlistItem) => {
    return watchlist.some((w: IWatchlistItem) => w.contractAddress === wallet.contractAddress);
  };

  const columns: ColumnDef<TData>[] = [
    {
      accessorKey: 'watchlist',
      header: '',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => handleStarClick({
            name: row.getValue("walletAddress") as string,
            contractAddress: row.getValue("walletAddress") as string,
            type: 'wallet'
          })}
        >
          {isTokenInWatchlist({
            name: row.getValue("walletAddress") as string,
            contractAddress: row.getValue("walletAddress") as string,
            type: 'wallet'
          }) ? <AiFillStar size={20} /> : <AiOutlineStar size={20} />}
        </div>
      ),
    },
    {
      accessorKey: 'rank',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rank
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.getValue("rank")}
        </div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <Link
          href={`/wallet/${row.getValue("walletAddress")}`}
          className="font-medium link link-hover hover:text-info"
        >
          <Copy
            href={`/wallet/${row.getValue("walletAddress")}`}
            text={minifyContract(row.getValue("walletAddress") as string)}
            value={row.getValue("walletAddress") as string}
          />
        </Link>
      ),
    },
    {
      accessorKey: 'buyAmountLabel',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Label
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('buyAmountLabel')}
        </div>
      ),
    },
    {
      accessorKey: 'netProfit',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            P&L
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {Number(row.getValue('netProfit')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'winRate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            WinRate
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('winRate')}
        </div>
      ),
    },
    {
      accessorKey: 'dayActive',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Active Days
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('dayActive')}
        </div>
      ),
    },
    {
      accessorKey: 'firstTopTokenHolder',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First Top Token Holder
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const firstTopTokenHolder = row.getValue('firstTopTokenHolder') as { tokenName: string;["Currency Address"]: string; };
        const hotTokenHolders = row.getValue('HotTokenHolders') as HotTokenHolder[];

        return (
          <div className="flex items-center gap-2">
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col gap-2"></div>
              {firstTopTokenHolder.tokenName
                ? firstTopTokenHolder.tokenName !== "-" &&
                firstTopTokenHolder["Currency Address"] && (
                  <Copy
                    text={
                      firstTopTokenHolder.tokenName !== "-"
                        ? firstTopTokenHolder.tokenName
                        : "-"
                    }
                    value={firstTopTokenHolder["Currency Address"]}
                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${firstTopTokenHolder["Currency Address"]}`}
                  />
                )
                :
                hotTokenHolders &&
                hotTokenHolders.length > 0 &&
                hotTokenHolders[0]?.tokenName &&
                hotTokenHolders[0]?.["Currency Address"] && (
                  <Copy
                    text={
                      firstTopTokenHolder.tokenName !== "-"
                        ? firstTopTokenHolder.tokenName
                        : "-"
                    }
                    href={`/tokens/${selectedChain.symbol.toLowerCase()}/${hotTokenHolders[0]["Currency Address"]}`}
                    value={hotTokenHolders[0]["Currency Address"]}
                  />
                )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'avgHoldingTime',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avg Position Duration
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {Math.ceil(row.getValue('avgHoldingTime')) || 0} D
        </div>
      ),
    },
    {
      accessorKey: 'age',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Age
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('age')}
        </div>
      ),
    },
    {
      accessorKey: 'TotalFee',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Fee (eth)
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {Number(row.getValue('TotalFee')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'dextrader',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dex Trader
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('details') === 'Dex Trader' ? 'yes' : 'no'}
        </div>
      ),
    },
    {
      accessorKey: 'notClosedPositions',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Not Closed
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('totalNumofFullyOpenedData')}
        </div>
      ),
    },
    {
      accessorKey: 'totalTransactions',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Transactions
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('totalTransactions')}
        </div>
      ),
    },
    {
      accessorKey: 'totalScore',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Score
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue('totalScore')}
        </div>
      ),
    },
  ]


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <ScrollArea className="w-full rounded-md pb-4">
          <ScrollBar orientation="horizontal" />
          <Table className="bg-card">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
