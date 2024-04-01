import React from "react";
import Logo from "../common/Logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../features/header/Toggle-theme";
import MobileMenu from "./mobile-menu";
import { Spotlight } from "../features/header/spotlight";
import ConnectButton from "../features/header/Connnet-wallet";
import ChainSelector from "../features/header/chain-selector";

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center gap-4 w-full flex-shrink-0 flex-grow">
      <div className="flex items-center justify-between w-full">
        <div className="inline-flex items-center justify-center gap-2">
          <MobileMenu />
          <Logo />
        </div>
        <ChainSelector />
        <ConnectButton />
        <ModeToggle />
      </div>
      <div className="w-full relative">
        <Spotlight />
      </div>
    </header>
  );
}
