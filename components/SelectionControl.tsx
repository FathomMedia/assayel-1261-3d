import React, { FC, useEffect, useState } from "react";
import { SelectFromList } from "./SelectFromList";
import { ITenant, IUnit, useAppContext } from "@/contexts/AppContexts";
import { Button, buttonVariants } from "./ui/button";

import { LuChevronLeft, LuXCircle } from "react-icons/lu";
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
    units,
    selectedBuildingId,
    resetCamera,
    selectedFloor,
    setSelectedFloor,
    selectedUnit,
    setSelectedUnit,
    setSelectedBuildingId,
    focusOn,
    selectedTenant,
    setSelectedTenant,
    tenants,
    buildings,
  } = useAppContext();
  const customFloorsOrder: { [key: string]: number } = { F2: 0, F1: 1, GR: 2 };

  const [availableFloors, setAvailableFloors] = useState<string[]>([]);
  const [availableUnits, setAvailableUnits] = useState<IUnit[]>([]);
  const [availableTenants, setAvailableTenants] = useState<ITenant[]>([]);

  const tempBuildings = buildings.map((b) => ({
    id: b.id,
    value: b.id,
  }));

  /* The bellow code is filtering units and tenants based on a selected building ID. It
  then creates a list of floors from the filtered units and tenants. The list of
  floors is then converted into an array of unique values and set as the available
  floors. */
  useEffect(() => {
    if (selectedBuildingId) {
      const tempUnits = units.filter(
        (u) => u.building_id === selectedBuildingId
      );
      const tempTenants = tenants.filter(
        (t) => t.building_id === selectedBuildingId
      );

      const tempFloorsList = [];

      for (const u in tempUnits) {
        if (Object.prototype.hasOwnProperty.call(tempUnits, u)) {
          const element = tempUnits[u];
          tempFloorsList.push(...element.floors);
        }
      }
      for (const t in tempTenants) {
        if (Object.prototype.hasOwnProperty.call(tempTenants, t)) {
          const element = tempTenants[t];
          tempFloorsList.push(...element.floors);
        }
      }

      const tempFloors = Array.from(new Set(tempFloorsList));
      setAvailableFloors(tempFloors);
    }

    return () => {};
  }, [selectedBuildingId, units, tenants]);

  /* The bellow code is a TypeScript React function. It checks if both `selectedFloor`
  and `selectedBuildingId` are truthy values. If they are, it filters the `units`
  array to get only the units that have a `building_id` equal to
  `selectedBuildingId` and that have `floors` array that includes `selectedFloor`.
  The filtered units are then set as the `availableUnits` state. */
  useEffect(() => {
    if (selectedFloor && selectedBuildingId) {
      const tempUnits = units
        .filter((u) => u.building_id === selectedBuildingId)
        .filter((u) => u.floors.includes(selectedFloor));

      setAvailableUnits(tempUnits ?? []);

      const tempTenants = tenants
        .filter((t) => t.building_id === selectedBuildingId)
        .filter((t) => t.floors.includes(selectedFloor));

      setAvailableTenants(tempTenants ?? []);
    }

    return () => {};
  }, [selectedBuildingId, selectedFloor, tenants, units]);

  return (
    <div className="flex flex-col justify-end w-full sm:gap-3 font-dax">
      {selectedBuildingId && (
        <div className="w-full p-6 bg-[#E2DEDC] max-w-2xl mx-auto text-foreground @container animate-in fade-in flex flex-col ">
          {/* Unit Card */}
          {selectedUnit && (
            <div className="flex flex-col h-full gap-1">
              {/* Unit Header */}
              <div className="flex flex-row justify-between gap-1">
                <div className="flex flex-wrap items-center">
                  <Button
                    variant={"ghost"}
                    className="px-0 rounded-none hover:bg-black/10"
                    onClick={() => setSelectedUnit(null)}
                  >
                    <LuChevronLeft className="w-6 h-6 text-foreground" />
                  </Button>
                  <h2 className="text-xl sm:text-2xl font-dax">
                    {selectedUnit?.id}
                  </h2>
                </div>
                {/* Actions */}
                <div className="flex items-center justify-between gap-1 ">
                  <div className="flex items-center">
                    {/* Close */}
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="px-2 rounded-none hover:bg-black/10 "
                      onClick={resetCamera}
                    >
                      <LuXCircle className="w-5 h-5 text-secondary" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Badges */}
              <div className="flex overflow-x-scroll">
                <div className="flex gap-2">
                  <Badge
                    variant={"outline"}
                    className="bg-transparent border-[0.5px] rounded-none min-w-fit hover:bg-transparent border-foreground"
                  >
                    Floors{": "}
                    {selectedUnit.floors
                      .sort(
                        (a, b) => customFloorsOrder[a] - customFloorsOrder[b]
                      )
                      .map(
                        (f, i) =>
                          `${f}${
                            i < selectedUnit.floors.length - 1 ? " + " : ""
                          }`
                      )}
                  </Badge>
                  {selectedUnit.type && (
                    <Badge
                      variant={"outline"}
                      className="bg-transparent border-[0.5px] rounded-none min-w-fit hover:bg-transparent border-foreground"
                    >
                      {selectedUnit.type}
                    </Badge>
                  )}
                  {selectedUnit.details?.map((d, i) => (
                    <Badge
                      key={i}
                      variant={"outline"}
                      className="bg-transparent border-[0.5px] rounded-none min-w-fit hover:bg-transparent border-foreground"
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* content */}
              <div className="flex flex-col gap-2 overflow-y-scroll grow">
                <p className="text-sm line-clamp-4">
                  {selectedUnit.description ?? "Coming soon."}
                </p>
                {
                  <Link
                    href={`${inquiryBaseUrl}/?your-message=Inquiry+for:+${selectedUnit.id}`}
                    target="_blank"
                    className={`${cn(
                      buttonVariants({ variant: "default", size: "sm" })
                    )} disabled:opacity-40 w-full !bg-[#4A4640] !hover:bg-[#4A4640]/80 rounded-none px-2 py-1 gap-2`}
                    type="button"
                  >
                    <span>Enquire</span>
                  </Link>
                }
              </div>
            </div>
          )}
          {/* Tenant Card */}
          {selectedTenant && (
            <div className="flex flex-col h-full gap-1">
              {/* Tenant Header */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    {/* Back button */}
                    <Button
                      variant={"ghost"}
                      className="hidden px-0 rounded-none hover:bg-black/10 sm:flex"
                      onClick={() => setSelectedTenant(null)}
                    >
                      <LuChevronLeft className="w-6 h-6 text-foreground" />
                    </Button>
                    <h2 className="text-xl sm:text-2xl font-dax">
                      {selectedTenant?.name}
                    </h2>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center justify-between gap-1 ">
                    <div className="flex items-center gap-1 ">
                      {openPano && (
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className={`px-2 py-0 rounded-none disabled:opacity-40 hover:bg-black/10`}
                          type="button"
                          onClick={openPano}
                          disabled={!selectedTenant?.panorama_url}
                        >
                          <Icon360
                            className={`${
                              !selectedTenant?.panorama_url && "text-gray-400"
                            } w-10 h-4`}
                          />
                        </Button>
                      )}
                      {/* Close */}
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        className="px-2 rounded-none hover:bg-black/10 "
                        onClick={resetCamera}
                      >
                        <LuXCircle className="w-5 h-5 text-secondary" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Badges */}
                <div className="w-full overflow-x-scroll">
                  <div className="flex w-full gap-2">
                    <Badge
                      variant={"outline"}
                      className="bg-transparent min-w-fit border-[0.5px] rounded-none hover:bg-transparent border-foreground"
                    >
                      Floors{": "}
                      {selectedTenant.floors.map(
                        (f, i) =>
                          `${f}${
                            i < selectedTenant.floors.length - 1 ? " + " : ""
                          }`
                      )}
                    </Badge>
                    {selectedTenant.type && (
                      <Badge
                        variant={"outline"}
                        className="bg-transparent min-w-fit border-[0.5px] rounded-none hover:bg-transparent border-foreground"
                      >
                        {selectedTenant.type}
                      </Badge>
                    )}
                    {selectedTenant.opening_times && (
                      <Badge
                        variant={"outline"}
                        className="bg-transparent min-w-fit border-[0.5px] rounded-none hover:bg-transparent border-foreground"
                      >
                        {selectedTenant.opening_times}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {/* content */}
              <div className="overflow-y-scroll grow">
                <p className="text-sm line-clamp-3">
                  {selectedTenant.description ?? "Coming soon."}
                </p>
                {selectedTenant.readmore_url && (
                  <Link
                    href={selectedTenant.readmore_url}
                    target="_blank"
                    className={`text-sm underline`}
                  >
                    <span>Read more...</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          {!selectedUnit && !selectedTenant && (
            <div className="flex justify-between mb-3 font-dax">
              <div className="flex items-center gap-2 rounded-none">
                {selectedBuildingId && selectedFloor && (
                  <Button
                    variant={"ghost"}
                    className="px-0 rounded-none hover:bg-black/10"
                    onClick={() => setSelectedFloor(null)}
                  >
                    <LuChevronLeft className="w-6 h-6 text-foreground" />
                  </Button>
                )}
                {selectedBuildingId && (
                  <h2 className="text:lg sm:text-2xl font-dax">
                    {selectedBuildingId?.toUpperCase()}
                  </h2>
                )}
                {selectedBuildingId && selectedFloor && (
                  <div className="flex items-center">
                    <span className="">-</span>

                    <Button
                      size={"default"}
                      variant={"ghost"}
                      className="px-2 rounded-none hover:bg-black/10 "
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
                className="px-2 rounded-none hover:bg-black/10 "
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
              {availableFloors
                .sort((a, b) => customFloorsOrder[a] - customFloorsOrder[b])
                .map((f, i) => (
                  <Button
                    size={"sm"}
                    onClick={() => setSelectedFloor(f)}
                    className="rounded-none bg-foreground hover:bg-secondary"
                    key={i}
                  >
                    {f}
                  </Button>
                ))}
            </div>
          )}

          {/* Select a unit / tenant */}
          {selectedBuildingId &&
            selectedFloor &&
            !selectedUnit &&
            !selectedTenant && (
              <div className="flex flex-col gap-2">
                {availableTenants.length > 0 && (
                  // Tenants
                  <div className="grid grid-cols-1 @xs:grid-cols-2 gap-2 overflow-y-scroll @md:grid-cols-3 @xl:grid-cols-4">
                    {availableTenants.map((t, i) => (
                      <Button
                        size={"sm"}
                        onClick={() => setSelectedTenant(t)}
                        className="rounded-none bg-foreground hover:bg-secondary"
                        key={i}
                      >
                        {t.name}
                      </Button>
                    ))}
                  </div>
                )}
                {
                  // Units
                  availableUnits.length > 0 && (
                    <div className="flex flex-col gap-3 ">
                      <div className="flex items-center gap-2">
                        <div className="w-full h-[1px] bg-zinc-400 "></div>
                        <p className="min-w-fit">Available for Inquiry</p>
                        <div className="w-full h-[1px] bg-zinc-400 "></div>
                      </div>

                      <div className="grid grid-cols-1 @xs:grid-cols-2 gap-2 overflow-y-scroll @md:grid-cols-3 @xl:grid-cols-4">
                        {availableUnits.map((u, i) => (
                          <Button
                            size={"sm"}
                            onClick={() => setSelectedUnit(u)}
                            className="rounded-none bg-primary hover:bg-secondary"
                            key={i}
                          >
                            {u.id}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                }
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
          setSelectedBuildingId(buildingId);
        }}
      />
    </div>
  );
};
