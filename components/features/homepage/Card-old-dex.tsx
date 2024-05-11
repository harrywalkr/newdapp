'use client'
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface CardProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  isCardOpen?: boolean;
}

export default function CardOldDex({
  title,
  icon,
  children,
  className,
  isCardOpen,
}: CardProps) {
  const [isOpen, setIsOpen] = useState(isCardOpen || false);
  const router = useRouter()


  return (
    <div
      className={clsx(
        "border border-border rounded-md p-2 mb-1",
        "transition ease-in-out delay-150",
        className
      )}
    >
      <div className="header flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          {icon && <div>{icon}</div>}
          <h2 className="text-lg">{title}</h2>
        </div>
        {isOpen ? (
          <FiChevronUp
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <>
            {
              localStorage.getItem("KEY") ?
                <FiChevronDown
                  className="cursor-pointer"
                  onClick={() => setIsOpen(true)}
                /> : <>
                  {
                    title === 'rank' ?
                      <FiChevronDown
                        className="cursor-pointer"
                        onClick={() => setIsOpen(true)}
                      /> :
                      <FaLock
                        className="cursor-pointer"
                        onClick={() => {
                          router.replace(`/login?redirect=/`);
                        }}
                      />
                  }
                </>
            }
          </>
        )}
      </div>
      <div
        className={clsx("body mt-4 transition ease-in-out delay-150", {
          hidden: !isOpen,
        })}
      >
        {children}
      </div>
    </div>
  );
}
