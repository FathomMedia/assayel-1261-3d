import { useState } from "react";
import { Building, buildingsData } from "@/src/data";
import { BuildingCard } from "@/components/buildingCard";
import { ListOfBuildings } from "@/components/ListOfBuildings";
import { PanoramaView } from "@/components/PanoView";
import { LuMinusCircle, LuPlusCircle, LuXCircle } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { City } from "@/components/City";
import { Canvas } from "@react-three/fiber";
import { useAppContext } from "@/contexts/AppContexts";
import { useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";
import { GetServerSideProps } from "next";
import { getAllFoldersInFolder } from "./api/getCloudinaryFolders";

interface Props {
  folders: string[] | undefined;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await getAllFoldersInFolder("360");

  return {
    props: {
      folders: res,
    },
  };
};

export default function Home({ folders }: Props) {
  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const [zoomedIn, setZoomedIn] = useState(false);
  const [showPano, setShowPano] = useState(false);

  const {
    selectedBuilding,
    setSelectedBuilding,
    focusOn,
    cameraControlRef,
    resetCamera,
  } = useAppContext();

  /**
   * The function "focusOnBuilding" updates the query parameter, sets the selected building, and focuses
   * on the building if it is not from 3D.
   * @param {Building} building - The `building` parameter is of type `Building` and represents the
   * building object that we want to focus on. It likely contains properties such as `buildingName`,
   * which is used in the function.
   * @param {boolean} [from3D] - The `from3D` parameter is a boolean flag that indicates whether the
   * function is being called from a 3D context or not. If `from3D` is `true`, it means the function is
   * being called from a 3D context, and if it is `false` or
   */
  function focusOnBuilding(building: Building, from3D?: boolean) {
    try {
      setSelectedBuilding(building);
      !from3D && focusOn(building.buildingName);
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
    <main className={`flex h-screen flex-col items-center justify-between`}>
      <div className="relative w-full h-full bg-[#F1E8DE]">
        <Canvas className="w-full h-full" shadows={"basic"}>
          {
            <City
              onBuildingClick={(name) => {
                const foundBuilding = buildingsData.find(
                  (b) => b.buildingName === name
                );

                foundBuilding
                  ? focusOnBuilding(foundBuilding, true)
                  : resetCamera();
              }}
            />
          }
        </Canvas>

        {
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-end justify-end px-0 sm:bottom-5 sm:px-5 md:flex-row">
            <div className="relative flex flex-col w-full h-full gap-3">
              {selectedBuilding && (
                <div className="px-5 sm:px-0">
                  <BuildingCard
                    building={selectedBuilding}
                    openPano={() => setShowPano(true)}
                    enable360={
                      folders
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
                ></ListOfBuildings>
              }
            </div>
          </div>
        }
      </div>
      {showPano && selectedBuilding && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center  ">
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
      <div className="absolute flex flex-col justify-center my-auto rounded-full h-fit top-14 bottom-14 right-5">
        {!selectedBuilding && (
          <div className="flex flex-col animate-in zoom-in duration-300 fade-in   p-0 rounded-full backdrop-blur-md bg-[#4A4640]/60">
            <Button
              className={`w-12 h-16 p-3 rounded-t-full shadow-none aspect-square bg-white/0 hover:bg-white/30 `}
              onClick={zoomIn}
              disabled={zoomedIn}
            >
              <LuPlusCircle className="w-full h-full" />
            </Button>
            <Button
              className={`w-12 h-16 p-3 rounded-b-full shadow-none aspect-square bg-white/0 hover:bg-white/30 `}
              onClick={zoomOut}
              disabled={!zoomedIn}
            >
              <LuMinusCircle className="w-full h-full" />
            </Button>
          </div>
        )}
      </div>
      {!isLoaded && <LoaderUI progress={progress} />}
    </main>
  );
}

function LoaderUI({ progress }: { progress: number }) {
  return (
    <div className="absolute top-5 right-5 left-5 flex">
      <div className="w-full max-w-xs bg-[#4A4640]/60 animate-in zoom-in duration-300 fade-in rounded-full gap-3 flex items-center p-2 mx-auto">
        <p className="text-white">Loading </p>
        <Progress className="w-full" value={progress} />
      </div>
    </div>
  );
}
