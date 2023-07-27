import { Building } from "@/src/data";
import React, { FC } from "react";

import { Button } from "@/components/ui/button";
import { Icon360 } from "@/components/icons/Icon360";
import { LuXCircle } from "react-icons/lu";
import { cn } from "@/src/utils";

interface Props {
  building: Building | null;
  openPano?: () => void;
  onClose?: () => void;
  enable360: boolean;
  className?: string;
}

export const BuildingCard: FC<Props> = ({
  building,
  openPano,
  enable360,
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        `flex relative px-6 py-5 duration-300 w-full rounded-lg min-h-[6rem] ${
          building
            ? "animate-in slide-in-from-left-20  bg-background "
            : " animate-out slide-out-to-left-20 "
        } ${className}`
      )}
    >
      <div className="flex flex-col justify-start gap-2 grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-dax">{building?.name}</h2>
            {openPano && enable360 && (
              <Button
                variant={"ghost"}
                className=" hover:bg-stone-200"
                type="button"
                onClick={openPano}
              >
                <Icon360 className="w-10 h-4" />
              </Button>
            )}
          </div>
          {building && (
            <Button
              variant={"ghost"}
              className="absolute px-2 top-2 right-2 hover:bg-stone-200"
              onClick={onClose}
            >
              <LuXCircle className="w-5 h-5 text-secondary" />
            </Button>
          )}
        </div>
        <p className="overflow-y-scroll text-xs text-secondary md:text-base max-h-20 font-dax ">
          {building?.description}
        </p>
      </div>
    </div>
  );
};
