'use client'

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useTokenChainStore from "@/store/tokenChains";
import Image from "next/image";
import { useMedia } from 'react-use';

export default function ChainSelector() {
  const { availableChains, selectedChain, setSelectedChain } = useTokenChainStore();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMedia('(max-width: 767px)');

  const triggerButton = (
    <Button
      className="flex items-end justify-end whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 md:h-10 lg:h-11 px-4 md:px-6 lg:px-8 py-2 md:py-3 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
      onClick={() => setIsOpen(!isOpen)}
    >
      chain: {selectedChain.symbol}
    </Button>
  );

  const content = (
    <>
      <DrawerHeader>
        <DrawerTitle>Choose Network Chain</DrawerTitle>
      </DrawerHeader>
      <DrawerFooter>
        {availableChains.map(chain => (
          <Button key={chain.id} variant="secondary"
            onClick={() => {
              setSelectedChain(chain.id);
              setIsOpen(!isOpen)
            }}>
            {chain.name}
            <Image
              src={`/networks/${chain.icon}`}
              height={20}
              width={20}
              alt={chain.name}
            />
          </Button>
        ))}
        <DrawerClose>
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            {triggerButton}
          </DrawerTrigger>
          <DrawerContent>
            {content}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {triggerButton}
          </DialogTrigger>
          <DialogContent>
            {content}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
