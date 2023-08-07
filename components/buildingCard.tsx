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
  onInquire?: () => void;
  enable360: boolean;
  className?: string;
}

export const BuildingCard: FC<Props> = ({
  building,
  openPano,
  enable360,
  onClose,
  className,
  onInquire,
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <h2 className="text-2xl order-2 sm:order-1 font-dax">
              {building?.name}
            </h2>
            <div className="flex items-center order-1 sm:order-2 gap-3 ">
              {/* Actions */}
              <div className="flex items-center gap-3 w-full">
                {openPano && enable360 && (
                  <Button
                    variant={"outline"}
                    className=" hover:bg-stone-200"
                    type="button"
                    onClick={openPano}
                  >
                    <Icon360 className="w-10 h-4" />
                  </Button>
                )}
                {onInquire && (
                  <Button
                    variant={"default"}
                    className="  hover:bg-[#947E3A]"
                    type="button"
                    onClick={onInquire}
                  >
                    Inquire
                  </Button>
                )}
              </div>
              {/* Close */}
              <Button
                variant={"ghost"}
                className="px-2 hover:bg-stone-200 "
                onClick={onClose}
              >
                <LuXCircle className="w-5 h-5 text-secondary" />
              </Button>
            </div>
          </div>
        </div>
        <p className="overflow-y-scroll text-xs text-secondary md:text-base max-h-20 font-dax ">
          {building?.description}
        </p>
      </div>
    </div>
  );
};
