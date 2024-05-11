import React, { useEffect, useState } from "react";
import "rc-slider/assets/index.css";
import "./sliderFilter-dex-old.scss";
import Slider from "rc-slider";
import CardOldDex from "./Card-old-dex";
import clsx from "clsx";
import { FilterType } from "@/types/topwallet.type";
import { nFormatter } from "@/utils/numberFormatter";
import { Input } from "@/components/ui/input";

interface Props {
  updateLocalFilters: (key: string, value: any) => void;
  filter: FilterType;
  resetFilter: number;
}

export default function Filter({
  updateLocalFilters,
  filter,
  resetFilter,
}: Props) {
  const [inputValue, setInputValue] = useState<any>(filter.value);

  useEffect(() => {
    setInputValue(filter.value);
  }, [resetFilter]);

  const update = (
    e: React.ChangeEvent<HTMLInputElement>,
    which: "to" | "from"
  ) => {
    let value = e.target.value;
    value = value.replace(/[^0-9-]+/g, "");
    var pattern = /([-])?([0-9]+)/g;
    var matches = value.match(pattern);
    if (matches) {
      value = matches[0];
    }
    if (value >= filter.value[0] && value <= filter.value[1]) {
      if (which == "to") return updateInputValue([inputValue[0], +value]);
      updateInputValue([+value, inputValue[1]]);
    }
  };

  const updateInputValue = (value: any) => {
    updateLocalFilters(filter.name, value);
    setInputValue(value);
  };

  return (
    <>
      {filter.type === "radio" && (
        <CardOldDex
          title={filter.name}
          icon={filter.icon}
          isCardOpen={filter.isCardOpen}
          className="mr-3"
        >
          <div className="flex gap-4 items-start justify-between p-5 mr-3">
            <div className="flex items-center justify-center gap-1">
              {filter.list!.map((item: string) => (
                <button
                  key={item}
                  className={clsx(
                    " text-sm p-1 rounded-md",
                    { "bg-red-400": inputValue === item },
                    { "bg-green-400": inputValue !== item }
                  )}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    setInputValue(e.currentTarget.innerText);
                    updateLocalFilters(filter.name, e.currentTarget.innerText);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </CardOldDex>
      )}
      {filter.type === "range" && (
        <CardOldDex
          title={filter.name}
          icon={filter.icon}
          isCardOpen={filter.isCardOpen}
          className="mr-3"
        >
          <div
            title={filter.name}
            className={`
          flex flex-col gap-4 items-start justify-center
           `}
          >
            <div className="flex items-center justify-between gap-3">
              <Input
                type="number"
                name="From"
                placeholder="From"
                value={inputValue[0]}
                onChange={(i) => update(i, "from")}
              />
              <Input
                type="number"
                name="To"
                placeholder="To"
                value={inputValue[1]}
                onChange={(i) => update(i, "to")}
              />
            </div>
            <div className="mt-2 w-full mb-3">
              <Slider
                range={true}
                marks={{
                  [filter.value[0]]: nFormatter(filter.value[0], 0),
                  [filter.value[1]]: nFormatter(filter.value[1], 0),
                }}
                min={filter.value[0]}
                max={filter.value[1]}
                onChange={(i: any) => {
                  updateLocalFilters(filter.name, i);
                  updateInputValue(i as number[]);
                }}
                value={inputValue}
              />
            </div>
          </div>
        </CardOldDex>
      )}
    </>
  );
}
