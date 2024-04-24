import React, { HTMLAttributes } from "react";
import Logo from "../common/Logo";
import { ModeToggle } from "../features/header/Toggle-theme";
import MobileMenu from "../features/header/mobile-menu";
import { Spotlight } from "../features/header/spotlight";
import ConnectButton from "../features/header/Connnet-wallet";
import ChainSelector from "../features/header/chain-selector";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LiaRobotSolid } from "react-icons/lia";

export default function Header({ className }: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 max-w-screen-2xl mx-auto z-50 px-5 2xl:px-0 py-5 bg-background flex flex-col items-center justify-center gap-4 flex-shrink-0 flex-grow",
        className
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex md:hidden items-center justify-center gap-2">
          <MobileMenu />
          <div>
            <Logo />
          </div>
        </div>
        <div className="flex items-center justify-start gap-20">
          <ChainSelector />
          <ul className="hidden md:flex items-center justify-center gap-10 text-muted-foreground">
            <li>
              ETH price: $25
            </li>
            <li>
              ETH price: $25
            </li>
            <li>
              ETH price: $25
            </li>
          </ul>
        </div>
        <ConnectButton />
        <div className="block md:hidden">
          <ModeToggle />
        </div>
      </div>
      <div className="w-full flex items-center justify-center relative gap-10">
        <div className="hidden md:flex " >
          <Logo />
        </div>
        <Spotlight />
        <ul className="hidden md:flex items-center justify-center gap-10">
          <li>Premium</li>
          <li>Watchlist</li>
        </ul>
        <div className="hidden md:flex items-center justify-center gap-6">
          <div  >
            <ModeToggle />
          </div>
          <div >
            <Button
              variant="ghost"
              size="icon"
            >
              <LiaRobotSolid className="text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
