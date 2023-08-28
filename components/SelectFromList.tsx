import React, { FC, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "@/src/utils";
import { useDraggable } from "react-use-draggable-scroll";

interface Props {
  items: {
    id: string;
    value: string;
  }[];
  selectedItemId: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

export const SelectFromList: FC<Props> = ({
  items,
  onSelect,
  selectedItemId,
  className,
}) => {
  const currentIndex = items.findIndex((item) => item.id === selectedItemId);
  const canGoPrevious = currentIndex > 0 && currentIndex !== -1;
  const canGoNext = currentIndex < items.length - 1 && items.length > 0;
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  /**
   * The function "goPrevious" checks if it is possible to go to the previous item and if so, calls the
   * "onSelect" function with the id of the previous item.
   */
  function goPrevious() {
    if (canGoPrevious) {
      onSelect && onSelect(items[currentIndex - 1].id);
    }
  }

  /**
   * The function "goNext" checks if it is possible to go to the next item and calls the "onSelect"
   * function with the ID of the next item if it exists.
   */
  function goNext() {
    if (canGoNext) {
      onSelect && onSelect(items[currentIndex + 1].id);
    }
  }

  /**
   * The function "goTo" calls the "onSelect" function with the provided "itemId" parameter if
   * "onSelect" is defined.
   * @param {string} itemId - The itemId parameter is a string that represents the ID of an item.
   */
  function goTo(itemId: string) {
    onSelect && onSelect(itemId);
  }

  /* The code block is a useEffect hook that is triggered whenever the currentIndex
  changes. It is responsible for scrolling the selected item into view smoothly. */
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
        `animate-in zoom-in duration-300 fade-in w-full max-w-4xl mx-auto flex justify-between items-center gap-0 px-0 sm:px-3 h-12 sm:h-14  rounded-none bg-[#E2DEDC] ${className}`
      )}
    >
      <Button
        size={"icon"}
        variant={"ghost"}
        disabled={!canGoPrevious}
        className="h-full rounded-none sm:h-9 hover:bg-black/10"
        onClick={goPrevious}
      >
        <LuChevronLeft className="w-6 h-6 text-foreground" />
      </Button>
      {
        <div
          ref={ref}
          {...events}
          className="flex w-full py-2 overflow-x-scroll no-scrollbar sm:py-3 grow"
        >
          <div className="flex duration-300 grow animate-in slide-in-from-left-20">
            <div className="flex w-full gap-3">
              {items.length === 0 && (
                <p className="text-gray-500 grow ">No data</p>
              )}
              {...items.map((b, i) => (
                <Button
                  variant={
                    items[currentIndex]?.id === b.id ? "default" : "secondary"
                  }
                  className={`text-xs flex-none font-normal rounded-none sm:text-base px-3 w-fit whitespace-nowrap hover:bg-primary hover:text-primary-foreground ${
                    items[currentIndex]?.id !== b.id &&
                    "bg-[#d7ccc7] text-foreground"
                  }`}
                  ref={(element) => (itemsRef.current[i] = element)}
                  key={`b-${i}`}
                  onClick={() => onSelect && goTo(b.id)}
                >
                  <p>{b.value}</p>
                </Button>
              ))}
            </div>
          </div>
        </div>
      }
      <Button
        variant={"ghost"}
        size={"icon"}
        className="h-full rounded-none hover:bg-black/10 sm:h-9"
        disabled={!canGoNext}
        onClick={goNext}
      >
        <LuChevronRight className="w-6 h-6 text-foreground" />
      </Button>
    </div>
  );
};
