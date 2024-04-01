import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <Image src="./logo.svg" height={30} width={30} alt="Dextrading logo" />
      <p className="text-secondary-foreground text-lg font-semibold">Dextrading</p>
    </span>
  );
}
