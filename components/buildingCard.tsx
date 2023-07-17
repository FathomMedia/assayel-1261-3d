import { Building } from "@/src/data";
import React, { FC } from "react";

interface Props {
  building: Building | null;
}

export const BuildingCard: FC<Props> = ({ building }) => {
  return (
    <div
      className={`flex flex-col justify-start p-6 duration-300  rounded-lg  min-h-[6rem] ${
        building
          ? "animate-in slide-in-from-left-20  bg-slate-100 "
          : " animate-out slide-out-to-left-20 "
      }`}
    >
      <h2 className="text-xl font-bold">{building?.name}</h2>
      <p className="text-sm text-slate-500">{building?.description}</p>
    </div>
  );
};
