import { Building } from "@/src/data";
import React, { FC } from "react";

interface Props {
  building: Building | null;
  openPano?: () => void;
  enable360: boolean;
}

export const BuildingCard: FC<Props> = ({ building, openPano, enable360 }) => {
  return (
    <div
      className={`flex p-6 duration-300 w-full rounded-lg min-h-[6rem] ${
        building
          ? "animate-in slide-in-from-left-20  bg-slate-100 "
          : " animate-out slide-out-to-left-20 "
      }`}
    >
      <div className="flex flex-col justify-start grow">
        <h2 className="text-xl font-bold">{building?.name}</h2>
        <p className="overflow-y-scroll text-sm text-slate-500 max-h-20">
          {building?.description}
        </p>
      </div>
      {openPano && building?.buildingName && enable360 && (
        <button
          className="bg-blue-500 text-white rounded-lg px-3 py-2"
          type="button"
          onClick={openPano}
        >
          360
        </button>
      )}
    </div>
  );
};
