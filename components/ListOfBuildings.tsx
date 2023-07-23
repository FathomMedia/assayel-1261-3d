import { Building } from "@/src/data";
import React, { FC } from "react";

interface Props {
  buildings: Building[];
  selected?: Building | null;
  onClickBuilding?: (building: Building) => void;
}

export const ListOfBuildings: FC<Props> = ({
  buildings,
  onClickBuilding,
  selected,
}) => {
  return (
    <div className="flex w-full gap-3">
      {...buildings.map((b, i) => (
        <div
          className={`px-3 py-2 rounded-lg w-fit whitespace-nowrap bg-slate-100 hover:cursor-pointer duration-100 ${
            selected?.id === b.id && "bg-[#AE9344] text-white"
          }`}
          key={i}
          onClick={() => onClickBuilding && onClickBuilding(b)}
        >
          <p>{b.name}</p>
        </div>
      ))}
    </div>
  );
};
