import { Building } from "@/src/data";
import React, { FC, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

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
    // itemsRef.current[currentIndex]?.scrollIntoView({ behavior: "smooth" });

    return () => {};
  }, []);

  return (
    <div className="flex justify-between items-center gap-3 px-3 rounded-lg bg-[#E2DEDC]/30">
      <Button
        variant={"ghost"}
        disabled={!canGoPrevious}
        className="hover:bg-black/10 px-2"
        onClick={goPrevious}
      >
        <LuChevronLeft className="text-foreground w-6 h-6" />
      </Button>
      <div className="flex w-full overflow-x-scroll   grow  ">
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
        className="hover:bg-black/10 px-2"
        disabled={!canGoNext}
        onClick={goNext}
      >
        <LuChevronRight className="text-foreground w-6 h-6" />
      </Button>
    </div>
  );
};
