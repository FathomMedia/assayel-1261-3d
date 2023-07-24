import Spline, { SPEObject, SplineEvent } from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Building, buildingsData } from "@/src/data";
import { BuildingCard } from "@/components/buildingCard";
import { ListOfBuildings } from "@/components/ListOfBuildings";
import { PanoramaView } from "@/components/PanoView";
import { LuXCircle } from "react-icons/lu";
import { GetServerSideProps } from "next";
import { getAllFoldersInFolder } from "./api/getCloudinaryFolders";
import { Button } from "@/components/ui/button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await getAllFoldersInFolder("360");

  return {
    props: {
      folders: res,
    },
  };
};

interface Props {
  folders: string[] | undefined;
}

export default function Home({ folders }: Props) {
  const splineRef = useRef<Application>();

  const defaultCameraId = "3B695796-4617-4F45-BF86-E0B33A41DF6B";
  const spline3dUrl =
    "https://draft.spline.design/myf8tXDn7ylVbxLi/scene.splinecode";
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
          <div className="absolute left-0 right-0 flex flex-col items-end justify-end px-5 md:flex-row bottom-5">
            <div className="relative w-full h-full flex flex-col gap-3">
              {selectedBuilding && (
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
          <div className="absolute top-0 bottom-0 left-0 right-0 animate-pulse bg-primary flex flex-col justify-center items-center">
            <p className="text-white text-xl font-semibold">
              Loading the map...
            </p>
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
            className="bg-white/50 hover:bg-white/70 text-foreground hover:text-primary absolute top-8 right-8 rounded-lg w-10 h-10 p-0 flex justify-center items-center"
          >
            <LuXCircle className="text-inherit w-5 h-5" />
          </Button>
        </div>
      )}
    </main>
  );
}
