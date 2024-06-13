import React, { HTMLAttributes } from "react";
import Logo from "../common/Logo";
import { ThemeToggle } from "../features/header/Toggle-theme";
import MobileMenu from "../features/header/mobile-menu";
import { Spotlight } from "../features/header/spotlight";
import ConnectWalletButton from "../features/header/Connnet-wallet";
import ChainSelector from "../features/header/chain-selector";
import { Button } from "../ui/button";
import { LiaRobotSolid } from "react-icons/lia";
import Link from "next/link";
import ChainInfo from "../features/header/chain-info";
import clsx from "clsx";

export default function Header({ className }: HTMLAttributes<HTMLHeadElement>) {
  return (
    <header
      className={clsx(
        "fixed top-0 right-0 left-0 max-w-screen-2xl mx-auto z-40 px-5 2xl:px-0 py-5 bg-background flex flex-col items-center justify-center gap-4 flex-shrink-0 flex-grow",
        className
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex lg:hidden items-center justify-center gap-2">
          <MobileMenu />
          <Link href='/'>
            <Logo />
          </Link>
        </div>
        <div className="flex items-center justify-start gap-20">
          <ChainSelector />
          <ChainInfo />
        </div>
        <ConnectWalletButton />
        <div className="block lg:hidden">
          <ThemeToggle />
        </div>
      </div>
      <div className="w-full flex items-center justify-center relative gap-10">
        <Link className="hidden lg:flex" href='/'>
          <Logo />
        </Link>
        <Spotlight />
        <ul className="hidden lg:flex items-center justify-center gap-10">
          <li className="px-4 py-2 rounded-md hover:bg-muted/50">
            <Link href='/watchlist'>
              Watchlist
            </Link>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-muted/50">
            <Link href='/academy'>
              Academy
            </Link>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-muted/50">
            <Link href='/pricing'>
              Premium
            </Link>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-muted/50">
            <Link href='/dashboard'>
              Dashboard
            </Link>
          </li>
        </ul>
        <div className="hidden lg:flex items-center justify-center gap-6">
          <div  >
            <ThemeToggle />
          </div>
          <div >
            <Button
              variant="secondary"
              size="icon"
            >
              <LiaRobotSolid className="text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </header >
  );
}
