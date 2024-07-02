'use client'
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
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header({ className }: HTMLAttributes<HTMLHeadElement>) {
  const router = useRouter()

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
            {/* <Image src="/logos/dextrading-logo-1.png" alt="dextrading logo" width={50} height={10} /> */}
          </Link>
        </div>
        <div className="flex items-center justify-start gap-20">
          <ChainSelector />
          <ChainInfo />
        </div>
        <div className="flex items-center justify-center gap-3">
          <ConnectWalletButton />
          <Button className="hidden md:block" onClick={() => router.push('/pricing')}>
            Premium
          </Button>
        </div>
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

          {/* <li className="px-4 py-2 rounded-md hover:bg-muted/50">
            <Link href='/dashboard'>
              Dashboard
            </Link>
          </li> */}
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
