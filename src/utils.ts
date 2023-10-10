import { Floors, Language } from "@/contexts/AppContexts";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFloorLocal(floor: string, language: Language) {
  switch (floor) {
    case "GR":
      return language === Language.ع ? "الطابق الارضي" : "Ground Floor";
    case "F1":
      return language === Language.ع ? "الطابق الاول" : "First Floor";
    case "F2":
      return language === Language.ع ? "الطابق الثاني" : "Second Floor";
    default:
      return floor;
  }
}
