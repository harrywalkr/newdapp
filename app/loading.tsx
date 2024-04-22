'use client'
import Loading from "@/components/common/Loading";
import React from "react";

export default function LoadingOverlay() {

  // FIXME: add random tips from an array

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-background bg-opacity-70 h-screen z-50 w-screen flex flex-col items-center justify-start gap-5 pt-[80%]"
    >
      <Loading width={70} height={70} />
      <p className="text-base md:text-lg text-muted-foreground px-10">Tip: You can find out the reliability of a token in token section.</p>
    </div>
  );
}
