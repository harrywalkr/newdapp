'use client'
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TbMenu2 } from "react-icons/tb";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/common/Logo";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <TbMenu2 className="text-secondary-foreground md:hidden" size={25} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <Link href='/' className="flex items-center justify-start pl-6">
          <Logo />
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <ul className="mt-3 flex flex-col items-start justify-center gap-4 text-base font-normal">
            <li>
              <Link href='/landing-page' onClick={() => setIsOpen(!isOpen)}>
                About us
              </Link>
            </li>
            <li>
              <Link href='/academy' onClick={() => setIsOpen(!isOpen)}>
                Academy
              </Link>
            </li>
            <li>
              <Link href='/robots' onClick={() => setIsOpen(!isOpen)}>
                Telegram robots
              </Link>
            </li>
            <li>
              <Link href='/academy' onClick={() => setIsOpen(!isOpen)}>
                Academy
              </Link>
            </li>
            <li>
              <Link href='/blog' onClick={() => setIsOpen(!isOpen)}>
                Blog
              </Link>
            </li>
            <li>
              <Link href='/pricing' onClick={() => setIsOpen(!isOpen)}>
                Pricing
              </Link>
            </li>
            {/* <li>
              <Link href='/dashboard' onClick={() => setIsOpen(!isOpen)}>
                Dashboard
              </Link>
            </li> */}
          </ul>

        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
