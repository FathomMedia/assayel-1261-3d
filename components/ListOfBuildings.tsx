import { Building } from "@/src/data";
import React, { FC, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "@/src/utils";

interface Props {
  buildings: Building[];
  selected?: Building | null;
  onClickBuilding?: (building: Building) => void;
  className?: string;
}

export const ListOfBuildings: FC<Props> = ({
  buildings,
  onClickBuilding,
  selected,
  className,
}) => {
  const currentIndex = buildings.findIndex((b) => b.id === selected?.id);
  const canGoPrevious = currentIndex > 0 && currentIndex !== -1;
  const canGoNext = currentIndex < buildings.length - 1 && buildings.length > 0;
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  function goPrevious() {
    if (canGoPrevious) {
      onClickBuilding && onClickBuilding(buildings[currentIndex - 1]);
    }
  }
  function goNext() {
    if (canGoNext) {
      onClickBuilding && onClickBuilding(buildings[currentIndex + 1]);
    }
  }

  function goTo(building: Building) {
    onClickBuilding && onClickBuilding(building);
  }

  useEffect(() => {
    //? this is removed cuz it scrolls the wordpress website to the name as well as the iframe
    // itemsRef.current[currentIndex]?.scrollIntoView({ behavior: "smooth" });

    return () => {};
  }, []);

  return (
    <div
      className={cn(
        `flex justify-between items-center gap-3 px-3 rounded-lg bg-[#E2DEDC]/30 ${className}`
      )}
    >
      <Button
        variant={"ghost"}
        disabled={!canGoPrevious}
        className="px-2 hover:bg-black/10"
        onClick={goPrevious}
      >
        <LuChevronLeft className="w-6 h-6 text-foreground" />
      </Button>
      <div className="flex w-full overflow-x-scroll grow ">
        <div className="flex p-3 duration-300 grow animate-in slide-in-from-left-20">
          <div className="flex w-full gap-3">
            {...buildings.map((b, i) => (
              <Button
                variant={selected?.id === b.id ? "default" : "secondary"}
                className={`text-xs font-normal md:text-base px-3 w-fit whitespace-nowrap hover:bg-primary hover:text-primary-foreground ${
                  selected?.id !== b.id && "bg-background text-foreground"
                }`}
                ref={(element) => (itemsRef.current[i] = element)}
                key={`b-${i}`}
                onClick={() => onClickBuilding && goTo(b)}
              >
                <p>{b.name}</p>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Button
        variant={"ghost"}
        className="px-2 hover:bg-black/10"
        disabled={!canGoNext}
        onClick={goNext}
      >
        <LuChevronRight className="w-6 h-6 text-foreground" />
      </Button>
    </div>
  );
};
