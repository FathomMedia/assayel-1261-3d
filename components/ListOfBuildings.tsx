import { Building } from "@/src/data";
import React, { FC, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "@/src/utils";
import { useDraggable } from "react-use-draggable-scroll";
import { useAppContext } from "@/contexts/AppContexts";

interface Props {
  buildings: Building[];

  onClickBuilding?: (building: Building) => void;
  className?: string;
}

export const ListOfBuildings: FC<Props> = ({
  buildings,
  onClickBuilding,

  className,
}) => {
  const { selectedBuilding } = useAppContext();

  const currentIndex = buildings.findIndex(
    (b) => b.name === selectedBuilding?.name
  );
  const canGoPrevious = currentIndex > 0 && currentIndex !== -1;
  const canGoNext = currentIndex < buildings.length - 1 && buildings.length > 0;
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

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
    itemsRef.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });

    return () => {};
  }, [currentIndex]);

  return (
    <div
      className={cn(
        `flex justify-between items-center gap-0 px-0 sm:px-3 h-12 sm:h-14 sm:rounded-xl backdrop-blur-md rounded-none bg-[#E2DEDC]/30 ${className}`
      )}
    >
      <Button
        size={"icon"}
        variant={"ghost"}
        disabled={!canGoPrevious}
        className="h-full rounded-none sm:rounded-l-lg sm:h-9 hover:bg-black/10"
        onClick={goPrevious}
      >
        <LuChevronLeft className="w-6 h-6 text-foreground" />
      </Button>
      <div
        ref={ref}
        {...events}
        className="flex w-full py-2 overflow-x-scroll no-scrollbar sm:py-3 grow"
      >
        <div className="flex duration-300 grow animate-in slide-in-from-left-20">
          <div className="flex w-full gap-3">
            {...buildings.map((b, i) => (
              <Button
                variant={
                  selectedBuilding?.name === b.name ? "default" : "secondary"
                }
                className={`text-xs flex-none font-normal sm:text-base px-3 w-fit whitespace-nowrap hover:bg-primary hover:text-primary-foreground ${
                  selectedBuilding?.name !== b.name &&
                  "bg-background text-foreground"
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
        size={"icon"}
        className="h-full rounded-none hover:bg-black/10 sm:rounded-r-lg sm:h-9"
        disabled={!canGoNext}
        onClick={goNext}
      >
        <LuChevronRight className="w-6 h-6 text-foreground" />
      </Button>
    </div>
  );
};
