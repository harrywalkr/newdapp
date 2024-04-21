'use client'

import { Button } from "@/components/ui/button";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCounterStore } from "@/store";


export default function ChainSelector() {

  const incrementAsync = useCounterStore((state) => state.incrementAsync);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <Drawer>
      <DrawerTrigger className="flex items-end justify-end whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 md:h-10 lg:h-11 px-4 md:px-6 lg:px-8 py-2 md:py-3 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80">
        chain: ETH
        
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Choose Network Chain</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={incrementAsync} variant="secondary">Etherium</Button>
          <Button variant="secondary">Bitcoin</Button>
          <Button variant="secondary">chain 2</Button>
          <Button variant="secondary">chain 3</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
