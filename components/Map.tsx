import { useState } from "react";
import { PanoramaView } from "@/components/PanoView";
import {
  LuMinusCircle,
  LuPlusCircle,
  LuXCircle,
  LuHelpCircle,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { City } from "@/components/City";
import { Canvas } from "@react-three/fiber";
import { Language, useAppContext } from "@/contexts/AppContexts";
import { useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";
import { SelectionControl } from "@/components/SelectionControl";
import { SearchBar } from "@/components/SearchBar";
import { useTour } from "@reactour/tour";

interface Props {
  hq?: boolean;
  ultra?: boolean;
}
export function Map({ hq, ultra }: Props) {
  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const [zoomedIn, setZoomedIn] = useState(false);
  const [showPano, setShowPano] = useState(false);

  const { isOpen, setIsOpen, setCurrentStep } = useTour();

  const {
    selectedTenant,
    focusOn,
    cameraControlRef,
    language,
    toggleLanguage,
  } = useAppContext();

  /**
   * The function "focusOnBuilding" sets the selected building ID and focuses on a specific building.
   * @param {string} buildingName - The `buildingName` parameter is a string that represents the name of
   * a building.
   */
  function focusOnBuilding(buildingName: string) {
    try {
      focusOn(buildingName);
    } catch (error) {}
  }

  /**
   * The function zoomIn() zooms the camera to a factor of 2 and sets the zoomedIn state to true.
   */
  function zoomIn() {
    cameraControlRef?.current?.zoomTo(2, true);
    setZoomedIn(true);
  }

  /**
   * The function zoomOut resets the zoom level of the camera control and updates the zoomedIn state to
   * false.
   */
  function zoomOut() {
    cameraControlRef?.current?.zoomTo(1, true);
    setZoomedIn(false);
  }

  return (
    <main className={`flex h-[100dvh] flex-col items-center justify-between`}>
      <div className="relative w-full h-full bg-[#F1F1F3]">
        <Canvas className="w-full h-full" shadows={"basic"}>
          {
            <City
              hq={hq}
              ultra={ultra}
              onBuildingClick={(building) => {
                building && focusOnBuilding(building.id);
              }}
            />
          }
        </Canvas>

        {
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-end justify-end px-0 sm:bottom-5 sm:px-5 md:flex-row">
            <div className="relative flex flex-col w-full gap-3 h-fit">
              <SelectionControl openPano={() => setShowPano(true)} />
            </div>
          </div>
        }
      </div>
      {showPano && selectedTenant?.panorama_url && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center ">
          <div
            className="absolute top-0 bottom-0 left-0 right-0 bg-black/20"
            onClick={() => {
              setShowPano(false);
            }}
          ></div>

          <PanoramaView baseUrl={selectedTenant?.panorama_url}></PanoramaView>

          <Button
            onClick={() => {
              setShowPano(false);
            }}
            variant={"secondary"}
            className="absolute flex items-center justify-center w-10 h-10 p-0 rounded-none bg-white/50 hover:bg-white/70 text-foreground hover:text-primary top-8 right-8"
          >
            <LuXCircle className="w-5 h-5 text-inherit" />
          </Button>
        </div>
      )}
      {/* Controls */}
      <div className="absolute flex flex-col justify-center gap-1 mb-auto rounded-none h-fit top-28 bottom-14 right-5">
        <div className="bg-[#4A4640]/60  backdrop-blur-md flex">
          <Button
            className="w-12 h-12 p-3 rounded-none shadow-none aspect-square bg-white/0 hover:bg-white/30"
            size={"icon"}
            onClick={() => {
              setIsOpen(!isOpen);
              setCurrentStep(0);
            }}
          >
            <LuHelpCircle className="w-full h-full" />
          </Button>
        </div>
        {/* Language */}
        <div className="bg-[#4A4640]/60 backdrop-blur-md flex step-1">
          <Button
            variant={"default"}
            size={"icon"}
            className={`w-12 h-12 rounded-none disabled:opacity-40  bg-white/0 text-white hover:bg-white/30  text-base`}
            type="button"
            onClick={() => {
              toggleLanguage();
            }}
          >
            {Language[language === Language.ENG ? Language.ع : Language.ENG]}
          </Button>
        </div>
        {/* Zoom */}

        <div className="flex step-2 flex-col animate-in zoom-in duration-300 fade-in p-0 rounded-none backdrop-blur-md bg-[#4A4640]/60">
          <Button
            className={`w-12 h-16 p-3 rounded-none shadow-none aspect-square bg-white/0 hover:bg-white/30 `}
            onClick={zoomIn}
            disabled={zoomedIn}
          >
            <LuPlusCircle className="w-full h-full" />
          </Button>
          <Button
            className={`w-12 h-16 p-3 rounded-none shadow-none aspect-square bg-white/0 hover:bg-white/30 `}
            onClick={zoomOut}
            disabled={!zoomedIn}
          >
            <LuMinusCircle className="w-full h-full" />
          </Button>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center gap-2 duration-300 sm:top-6 animate-in zoom-in fade-in">
        <SearchBar />
        {!isLoaded && <LoaderUI progress={progress} />}
      </div>
    </main>
  );
}

function LoaderUI({ progress }: { progress: number }) {
  const { language } = useAppContext();
  const isAr = language === Language.ع;
  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="w-full max-w-xs bg-[#4A4640]/60 rounded-none gap-3 flex items-center p-2 px-4 mx-auto"
    >
      <p className="text-white">{isAr ? "تحميل" : "Loading"}</p>
      <Progress className="w-full rounded-none" value={progress} />
    </div>
  );
}
