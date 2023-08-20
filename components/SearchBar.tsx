"use client";

import * as React from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import { cn } from "@/src/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppContext } from "@/contexts/AppContexts";

export function SearchBar() {
  const [open, setOpen] = React.useState(false);

  const {
    units,
    tenants,
    selectedTenant,
    setSelectedTenant,
    setSelectedUnit,
    selectedUnit,
    setSelectedFloor,
    focusOn,
    setSelectedBuildingId,
  } = useAppContext();
  const unitsSearchData: { value: string; label: string }[] = units.map(
    (u) => ({
      value: u.id,
      label: `${u.building_id} - ${u.id}`,
    })
  );
  const tenantsSearchData: { value: string; label: string }[] = tenants.map(
    (t) => ({
      value: t.id,
      label: `${t.buildings[0]} - ${t.name}`,
    })
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full max-w-xs"
        >
          {selectedUnit
            ? selectedUnit.id
            : selectedTenant
            ? selectedTenant.name
            : "Search..."}
          <LuChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 ">
        <Command className="max-h-96">
          <CommandInput placeholder="Search unit..." />
          <CommandEmpty>No unit found.</CommandEmpty>
          <CommandGroup className="overflow-y-scroll">
            {tenantsSearchData.map((tenant) => (
              <CommandItem
                key={tenant.value}
                onSelect={() => {
                  const tempTenant = tenants.find((t) => t.id === tenant.value);
                  if (tempTenant) {
                    focusOn(tempTenant.buildings[0]);
                    setSelectedBuildingId(tempTenant.buildings[0]);
                    setSelectedFloor(tempTenant.floors[0]);
                    setSelectedTenant(tempTenant);
                    setSelectedUnit(null);
                  }
                  setOpen(false);
                }}
              >
                <LuCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    (selectedUnit?.id ?? "") === tenant.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {tenant.label}
              </CommandItem>
            ))}
            {unitsSearchData.map((unit) => (
              <CommandItem
                key={unit.value}
                onSelect={() => {
                  const tempUnit = units.find((u) => u.id === unit.value);
                  if (tempUnit) {
                    focusOn(tempUnit.building_id);
                    setSelectedBuildingId(tempUnit.building_id);
                    setSelectedFloor(tempUnit.floors[0]);
                    setSelectedUnit(tempUnit);
                    setSelectedTenant(null);
                  }
                  setOpen(false);
                }}
              >
                <LuCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    (selectedUnit?.id ?? "") === unit.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {unit.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
