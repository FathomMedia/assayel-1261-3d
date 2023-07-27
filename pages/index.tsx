import Spline, { SPEObject, SplineEvent } from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Building, buildingsData } from "@/src/data";
import { BuildingCard } from "@/components/buildingCard";
import { ListOfBuildings } from "@/components/ListOfBuildings";
import { PanoramaView } from "@/components/PanoView";
import { LuMinusCircle, LuPlusCircle, LuXCircle } from "react-icons/lu";
import { GetServerSideProps } from "next";
import { getAllFoldersInFolder } from "./api/getCloudinaryFolders";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await getAllFoldersInFolder("360");

  const focus = ctx.query.focus ?? null;

  return {
    props: {
      folders: res,
      focus,
    },
  };
};

interface Props {
  folders: string[] | undefined;
  focus: string | null;
}

export default function Home({ folders, focus }: Props) {
  const splineRef = useRef<Application>();

  const defaultCameraId = "3B695796-4617-4F45-BF86-E0B33A41DF6B";
  const spline3dUrl =
    "https://draft.spline.design/vjyQIWPKirClyG-p/scene.splinecode";
  const defaultCamera = useRef<SPEObject | undefined>();

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  const [isLoaded, setIsLoaded] = useState(false);
  const [showPano, setShowPano] = useState(false);

  function onLoad(spline: Application) {
    splineRef.current = spline;
    findObject(spline, defaultCameraId, defaultCamera);
    setTimeout(() => {
      setIsLoaded(true);
      if (focus) {
        const focusBuilding = buildingsData.find((b) => b.id === focus);
        focusBuilding && focusOnBuilding(focusBuilding);
      }
    }, 1000);
  }

  function findObject(
    spline: Application,
    id: string,
    ref: MutableRefObject<SPEObject | undefined>
  ) {
    const obj = spline.findObjectById(id);
    ref.current = obj;
  }

  function resetCamera() {
    splineRef.current?.emitEvent("mouseDown", defaultCameraId);
  }

  function onMouseDown(e: SplineEvent) {
    const index = buildingsData.findIndex((b) => b.id === e.target.id);

    if (index >= 0) {
      focusOnBuilding(buildingsData[index]);
    } else {
      setSelectedBuilding(null);
    }
  }

  useEffect(() => {
    return () => {};
  }, [selectedBuilding]);

  function focusOnBuilding(building: Building) {
    try {
      setSelectedBuilding(building);
      splineRef.current?.emitEvent("mouseDown", building.id);
    } catch (error) {}
  }

  function zoomIn() {
    splineRef.current?.setZoom(1);
    splineRef.current?.setZoom(1.2);
  }
  function zoomOut() {
    splineRef.current?.setZoom(1);
    splineRef.current?.setZoom(0.8);
  }

  return (
    <main className={`flex h-screen flex-col items-center justify-between`}>
      <div className="relative w-full h-full ">
        <Spline
          className="w-full h-full"
          onLoad={onLoad}
          onMouseDown={onMouseDown}
          scene={spline3dUrl}
        />
        {isLoaded && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-end justify-end px-0 sm:bottom-5 sm:px-5 md:flex-row">
            <div className="relative flex flex-col w-full h-full gap-3">
              {selectedBuilding && (
                <div className="px-5 sm:px-0">
                  <BuildingCard
                    building={selectedBuilding}
                    openPano={() => setShowPano(true)}
                    enable360={
                      selectedBuilding.buildingName && folders
                        ? folders.includes(selectedBuilding.buildingName)
                        : false
                    }
                    onClose={resetCamera}
                  ></BuildingCard>
                </div>
              )}
              {
                <ListOfBuildings
                  buildings={buildingsData}
                  onClickBuilding={focusOnBuilding}
                  selected={selectedBuilding}
                ></ListOfBuildings>
              }
            </div>
          </div>
        )}
        {!isLoaded && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center gap-2 bg-secondary">
            <AiOutlineLoading3Quarters className="w-5 h-5 text-white animate-spin" />
            <p className="text-xl font-light text-white">Loading</p>
          </div>
        )}
      </div>
      {showPano && selectedBuilding && selectedBuilding.buildingName && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center p-5 ">
          <div
            className="absolute top-0 bottom-0 left-0 right-0 bg-black/20"
            onClick={() => {
              setShowPano(false);
            }}
          ></div>

          <PanoramaView
            buildingName={selectedBuilding.buildingName}
          ></PanoramaView>

          <Button
            onClick={() => {
              setShowPano(false);
            }}
            variant={"secondary"}
            className="absolute flex items-center justify-center w-10 h-10 p-0 rounded-lg bg-white/50 hover:bg-white/70 text-foreground hover:text-primary top-8 right-8"
          >
            <LuXCircle className="w-5 h-5 text-inherit" />
          </Button>
        </div>
      )}
      {/* Zoom Controls */}
      {!selectedBuilding && isLoaded && (
        <div className="absolute flex flex-col justify-center my-auto rounded-full h-fit top-14 bottom-14 right-5">
          <div className="flex flex-col  p-0 rounded-full backdrop-blur-md bg-[#4A4640]/60">
            <Button
              className="w-12 h-16 p-3 rounded-t-full shadow-none aspect-square bg-white/0 hover:bg-white/20"
              onClick={zoomIn}
            >
              <LuPlusCircle className="w-full h-full" />
            </Button>
            <Button
              className="w-12 h-16 p-3 rounded-b-full shadow-none aspect-square bg-white/0 hover:bg-white/20"
              onClick={zoomOut}
            >
              <LuMinusCircle className="w-full h-full" />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
