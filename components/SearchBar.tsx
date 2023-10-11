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
import { Language, useAppContext } from "@/contexts/AppContexts";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
    language,
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
      value: t.id.toString(),
      label: `${t.building_id} - ${t.name}`,
    })
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          dir={language == Language.ع ? "rtl" : "ltr"}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full rounded-none sm:max-w-xs step-4"
        >
          {selectedUnit
            ? selectedUnit.id
            : selectedTenant
            ? selectedTenant.name
            : language == Language.ع
            ? "إبحث..."
            : "Search..."}
          <LuChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-none">
        <Command className="rounded-none max-h-96">
          <CommandInput
            dir={language == Language.ع ? "rtl" : "ltr"}
            className="rounded-none "
            placeholder={language == Language.ع ? "إبحث" : "Search unit..."}
          />
          <CommandEmpty>No unit found.</CommandEmpty>
          <CommandGroup className="overflow-y-scroll">
            {tenantsSearchData.map((tenant) => {
              const tempTenant = tenants.find(
                (t) => t.id.toString() === tenant.value
              );

              return (
                <CommandItem
                  key={tenant.value}
                  onSelect={() => {
                    if (tempTenant) {
                      tempTenant.building_id && focusOn(tempTenant.building_id);
                      setSelectedBuildingId(tempTenant.building_id);
                      setSelectedFloor(tempTenant.floors[0]);
                      setSelectedTenant(tempTenant);
                      setSelectedUnit(null);
                    }

                    setOpen(false);
                  }}
                >
                  <Avatar
                    className={`mx-2 w-8 h-8 bg-[#635E57] ${
                      (selectedTenant?.id ?? "") === tenant.value &&
                      "ring ring-primary"
                    }`}
                  >
                    {tempTenant?.logo_url && (
                      <AvatarImage src={tempTenant?.logo_url} />
                    )}
                    <AvatarFallback className="bg-[#635E57] text-white">
                      {tempTenant?.name.slice(0, 2) ?? "SP"}
                    </AvatarFallback>
                  </Avatar>
                  {tenant.label}
                </CommandItem>
              );
            })}
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
