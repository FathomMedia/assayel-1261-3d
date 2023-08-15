import React, { FC, useEffect, useState } from "react";
import { SelectFromList } from "./SelectFromList";
import { Unit, useAppContext } from "@/contexts/AppContexts";
import { Button, buttonVariants } from "./ui/button";

import { LuChevronLeft, LuChevronRight, LuXCircle } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";
import { Icon360 } from "./icons/Icon360";
import Link from "next/link";
import { cn } from "@/src/utils";
import { Badge } from "./ui/badge";

interface Props {
  openPano?: () => void;
}

export const SelectionControl: FC<Props> = ({ openPano }) => {
  const inquiryBaseUrl = "http://1261.fthm.me/contact";

  const {
    unitData,
    selectedBuildingId,
    resetCamera,
    selectedFloor,
    setSelectedFloor,
    selectedUnit,
    setSelectedUnit,
    focusOn,
  } = useAppContext();

  const [availableFloors, setAvailableFloors] = useState<string[]>([]);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);

  const tempBuildings = Array.from(
    new Set(unitData.map((u) => u.buildingId))
  ).map((b) => ({
    id: b,
    value: b.toUpperCase(),
  }));

  useEffect(() => {
    if (selectedBuildingId) {
      const tempUnits = unitData.filter(
        (u) => u.buildingId === selectedBuildingId
      );

      const tempFloorsList = [];

      for (const u in tempUnits) {
        if (Object.prototype.hasOwnProperty.call(tempUnits, u)) {
          const element = tempUnits[u];
          tempFloorsList.push(...element.floors);
        }
      }

      const tempFloors = Array.from(new Set(tempFloorsList));
      setAvailableFloors(tempFloors);
    }

    return () => {};
  }, [selectedBuildingId, unitData]);

  useEffect(() => {
    if (selectedFloor && selectedBuildingId) {
      const tempUnits = unitData
        .filter((u) => u.buildingId === selectedBuildingId)
        .filter((u) => u.floors.includes(selectedFloor));

      setAvailableUnits(tempUnits ?? []);
    }

    return () => {};
  }, [selectedBuildingId, selectedFloor, unitData]);

  return (
    <div className="flex flex-col justify-end w-full gap-3">
      {selectedBuildingId && (
        <div className="w-full p-6 bg-[#E2DEDC] text-foreground h-64 flex flex-col rounded-xl">
          {/* Unit Card */}
          {selectedUnit && (
            <div className="flex flex-col h-full">
              {/* Unit Header */}
              <div className="flex flex-col justify-between gap-1 sm:flex-row">
                <div className="flex flex-wrap items-center order-2 py-2 sm:order-1">
                  <Button
                    variant={"ghost"}
                    className="hidden px-0 hover:bg-black/10 sm:flex"
                    onClick={() => setSelectedUnit(null)}
                  >
                    <LuChevronLeft className="w-6 h-6 text-foreground" />
                  </Button>
                  <h2 className="text-xl sm:text-2xl font-dax">
                    {selectedUnit?.displayName}
                  </h2>
                  <Badge
                    variant={"outline"}
                    className="mx-2 bg-transparent rounded-full hover:bg-transparent border-foreground"
                  >
                    Floors{": "}
                    {selectedUnit.floors.map(
                      (f, i) =>
                        `${f}${i < selectedUnit.floors.length - 1 ? " + " : ""}`
                    )}
                  </Badge>
                  <Badge
                    variant={"outline"}
                    className="mx-2 bg-transparent rounded-full hover:bg-transparent border-foreground"
                  >
                    {selectedUnit.type}
                  </Badge>
                </div>
                {/* Actions */}
                <div className="flex items-center justify-between order-1 gap-1 sm:order-2">
                  <Button
                    variant={"ghost"}
                    className="flex px-0 mr-auto sm:hidden hover:bg-black/10"
                    onClick={() => setSelectedUnit(null)}
                  >
                    <LuChevronLeft className="w-6 h-6 text-foreground" />
                  </Button>
                  <div className="flex items-center">
                    {selectedUnit.readmoreUrl && (
                      <Link
                        href={selectedUnit.readmoreUrl}
                        target="_blank"
                        className={`${cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )} disabled:opacity-40 bg-transparent border border-zinc-700 hover:bg-black/10 px-2 py-1 gap-2`}
                        type="button"
                      >
                        <span>Read more</span>
                      </Link>
                    )}
                    {!selectedUnit.isrented && (
                      <Link
                        href={`${inquiryBaseUrl}/?your-message=Inquiry+for:+${selectedUnit.buildingId}-${selectedFloor}-${selectedUnit.id}`}
                        target="_blank"
                        className={`${cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )} disabled:opacity-40 bg-transparent border border-zinc-700 hover:bg-black/10 px-2 py-1 gap-2`}
                        type="button"
                      >
                        <BsQuestionCircle
                          className={`${
                            !selectedUnit?.panoramaUrl && "text-foreground"
                          } w-4 h-4`}
                        />
                        <span>Inquiry</span>
                      </Link>
                    )}
                    {openPano && (
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        className={`px-2 py-0 disabled:opacity-40 hover:bg-black/10`}
                        type="button"
                        onClick={openPano}
                        disabled={!selectedUnit?.panoramaUrl}
                      >
                        <Icon360
                          className={`${
                            !selectedUnit?.panoramaUrl && "text-gray-400"
                          } w-10 h-4`}
                        />
                      </Button>
                    )}
                    {/* Close */}
                    <Button
                      variant={"ghost"}
                      className="px-2 hover:bg-black/10 "
                      onClick={resetCamera}
                    >
                      <LuXCircle className="w-5 h-5 text-secondary" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* content */}
              <div className="overflow-y-scroll sm:px-6 grow">
                <p className="text-sm">
                  {selectedUnit.description ?? "Coming soon."}
                </p>
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          {!selectedUnit && (
            <div className="flex justify-between mb-3 font-dax">
              <div className="flex items-center gap-2 rounded-lg">
                {selectedBuildingId && (
                  <h2 className="text:lg sm:text-2xl font-dax">
                    {selectedBuildingId?.toUpperCase()}
                  </h2>
                )}
                {selectedBuildingId && selectedFloor && (
                  <div className="flex items-center">
                    <LuChevronRight className="w-4 h-4 text-foreground" />

                    <Button
                      size={"default"}
                      variant={"ghost"}
                      className="px-2 hover:bg-black/10 "
                      onClick={() => setSelectedFloor(null)}
                    >
                      {selectedFloor.toUpperCase()}
                    </Button>
                  </div>
                )}
              </div>
              {/* Close */}
              <Button
                variant={"ghost"}
                className="px-2 hover:bg-black/10 "
                onClick={resetCamera}
              >
                <LuXCircle className="w-5 h-5 text-secondary" />
              </Button>
            </div>
          )}
          {/* Floor/Unit selector */}
          {/* Select a floor */}
          {selectedBuildingId && !selectedFloor && (
            <div className="grid grid-cols-1 gap-2">
              {availableFloors.map((f, i) => (
                <Button
                  size={"sm"}
                  onClick={() => setSelectedFloor(f)}
                  className="bg-foreground hover:bg-secondary"
                  key={i}
                >
                  {f}
                </Button>
              ))}
            </div>
          )}

          {/* Select a unit */}
          {selectedBuildingId && selectedFloor && !selectedUnit && (
            <div className="flex flex-col gap-2">
              {availableUnits.filter((u) => u.isrented).length > 0 && (
                <div className="grid grid-cols-2 gap-2 overflow-y-scroll md:grid-cols-3 lg:grid-cols-4">
                  {availableUnits
                    .filter((u) => u.isrented)
                    .map((u, i) => (
                      <Button
                        size={"sm"}
                        onClick={() => setSelectedUnit(u)}
                        className="bg-foreground hover:bg-secondary"
                        key={i}
                      >
                        {u.displayName}
                      </Button>
                    ))}
                </div>
              )}
              {availableUnits.filter((u) => !u.isrented).length > 0 && (
                <div className="flex flex-col gap-3 mt-2 ">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-[1px] bg-zinc-400 "></div>
                    <p className="min-w-fit">Available for Inquiry</p>
                    <div className="w-full h-[1px] bg-zinc-400 "></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 overflow-y-scroll md:grid-cols-3 lg:grid-cols-4">
                    {availableUnits
                      .filter((u) => !u.isrented)
                      .map((u, i) => (
                        <Button
                          size={"sm"}
                          onClick={() => setSelectedUnit(u)}
                          className="bg-primary hover:bg-secondary"
                          key={i}
                        >
                          {u.displayName}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Building selector */}
      <SelectFromList
        items={tempBuildings}
        selectedItemId={selectedBuildingId?.toUpperCase() ?? null}
        onSelect={(buildingId) => {
          focusOn(buildingId);
        }}
      />
    </div>
  );
};
