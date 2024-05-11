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

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <TbMenu2 className="text-secondary-foreground md:hidden" size={25} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <ul className="mt-3 flex flex-col items-start justify-center gap-3 text-base font-normal">
              <li>
                <Link href='/about-us' onClick={() => setIsOpen(!isOpen)}>
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
            </ul>
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
