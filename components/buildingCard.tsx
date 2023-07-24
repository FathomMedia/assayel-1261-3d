import { Building } from "@/src/data";
import React, { FC } from "react";

import { Button } from "@/components/ui/button";
import { Icon360 } from "@/components/icons/Icon360";

interface Props {
  building: Building | null;
  openPano?: () => void;
  enable360: boolean;
}

export const BuildingCard: FC<Props> = ({ building, openPano, enable360 }) => {
  return (
    <div
      className={`flex px-6 py-5 duration-300 w-full rounded-lg min-h-[6rem] ${
        building
          ? "animate-in slide-in-from-left-20  bg-background "
          : " animate-out slide-out-to-left-20 "
      }`}
    >
      <div className="flex flex-col justify-start grow gap-2">
        <div className="flex gap-3 items-center">
          <h2 className="text-2xl font-dax">{building?.name}</h2>
          {openPano && building?.buildingName && enable360 && (
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
        <p className="overflow-y-scroll text-xs text-secondary md:text-base max-h-20 font-dax ">
          {building?.description}
        </p>
      </div>
    </div>
  );
};
