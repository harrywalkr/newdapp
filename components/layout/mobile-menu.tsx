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
        <TbMenu2 className="text-secondary-foreground" size={25} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>menu</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
