"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { spotlightSearch } from "@/http/features/spotlight.http";
import { searchToken } from "@/http/token.http";
import { useEffect, useState } from "react";
import { SpotlightSearchType } from "@/types/features/spotlight.type";
import { Token } from "@/types/token.type";

export function Spotlight() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SpotlightSearchType | Token>();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    spotlightSearch({ params: { address: searchTerm } })
      .then(({ data }) => {
        if (data.subject.label.includes("Wallet")) return setData(data);
        searchToken({
          params: {
            currencyAddress: searchTerm,
          },
        })
          .then(({ data }) => {
            setData(data);
          })
          .finally(() => setLoading(false));
      })
      .finally(() => setLoading(false));
    return () => {
      controller.abort();
    };
  }, [searchTerm]);

  return (
    <>
      <div className="w-full relative">
        <Input
          onFocus={(e) => {
            e.preventDefault();
            setOpen((open) => !open);
          }}
          type="text"
          placeholder="Search for Wallets, Tokens, NFTs ..."
        />
        <kbd className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 relative overflow-hidden top-[30%]  md:top-[40%] lg:top-[50%]">
          <div>
            <Input
              placeholder="Search for Wallets, Tokens, NFTs ..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
