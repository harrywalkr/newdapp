'use client'
import Loading from "@/components/common/Loading";
import React from "react";

const tips: string[] = [
  'Tip: You can find out the reliability of a token in token section.',
  'Tip: Press ctrl+j to access info on tokens and their investibility'
]

const randomIndex = Math.floor(Math.random() * tips.length);

export default function LoadingOverlay() {

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-background bg-opacity-70 h-screen z-50 w-screen flex flex-col items-center justify-center gap-5"
    >
      <Loading width={70} height={70} />
      <p className="text-base md:text-lg text-muted-foreground px-10">
        {tips[randomIndex]}
      </p>
    </div>
  );
}
