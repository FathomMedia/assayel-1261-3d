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
    unitData,
    setSelectedUnit,
    selectedUnit,
    setSelectedFloor,
    focusOn,
    setSelectedBuildingId,
  } = useAppContext();
  const searchData: { value: string; label: string }[] = unitData.map((u) => ({
    value: u.id,
    label: `${u.buildingId} - ${u.displayName}`,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedUnit ? selectedUnit.displayName : "Search..."}
          <LuChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search unit..." />
          <CommandEmpty>No unit found.</CommandEmpty>
          <CommandGroup>
            {searchData.map((unit) => (
              <CommandItem
                key={unit.value}
                onSelect={() => {
                  const tempUnit = unitData.find((u) => u.id === unit.value);
                  if (tempUnit) {
                    focusOn(tempUnit.buildingId);
                    setSelectedBuildingId(tempUnit.buildingId);
                    setSelectedFloor(tempUnit.floors[0]);
                    setSelectedUnit(tempUnit);
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
