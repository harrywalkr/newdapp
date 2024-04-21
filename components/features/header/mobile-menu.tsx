import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TbMenu2 } from "react-icons/tb";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger>
        <TbMenu2 className="text-secondary-foreground md:hidden" size={25} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <ul className="mt-3 flex flex-col items-start justify-center gap-3 text-base font-normal">
              <li>About us</li>
              <li>Academy</li>
              <li>Telegram robots</li>
            </ul>
          </SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
