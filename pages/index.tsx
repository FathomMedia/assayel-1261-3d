import { useEffect, useState } from "react";
import { Building, buildingsData } from "@/src/data";
import { BuildingCard } from "@/components/buildingCard";
import { ListOfBuildings } from "@/components/ListOfBuildings";
import { PanoramaView } from "@/components/PanoView";
import { LuMinusCircle, LuPlusCircle, LuXCircle } from "react-icons/lu";
import { GetServerSideProps } from "next";
import { getAllFoldersInFolder } from "./api/getCloudinaryFolders";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/router";
import { City } from "@/components/City";
import { Canvas } from "@react-three/fiber";
import { useAppContext } from "@/contexts/AppContexts";

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

export default function Home({ folders }: Props) {
  const router = useRouter();

  const { selectedBuilding, setSelectedBuilding, focusOn, cameraControlRef } =
    useAppContext();

  const [zoomedIn, setZoomedIn] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(true);
  const [showPano, setShowPano] = useState(false);

  function resetCamera() {
    focusOn("");
    setSelectedBuilding(null);
    removeQueryPram("focus");
  }

  useEffect(() => {
    return () => {};
  }, [selectedBuilding]);

  function focusOnBuilding(building: Building, from3D?: boolean) {
    try {
      updateQueryPram(building.buildingName);
      setSelectedBuilding(building);
      !from3D && focusOn(building.buildingName);
    } catch (error) {}
  }

  function updateQueryPram(buildingId: string) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, focus: buildingId },
    });
  }
  function removeQueryPram(queryPramName: string) {
    const query = { ...router.query };
    delete query[queryPramName];

    router.replace({
      pathname: router.pathname,
      query,
    });
  }

  function zoomIn() {
    cameraControlRef?.current?.zoomTo(2, true);
    setZoomedIn(true);
  }
  function zoomOut() {
    cameraControlRef?.current?.zoomTo(1, true);
    setZoomedIn(false);
  }

  return (
    <main className={`flex h-screen flex-col items-center justify-between`}>
      <div className="relative w-full h-full ">
        <Canvas className="w-full h-full">
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
        {/* {!isLoaded && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center gap-2 bg-secondary">
            <AiOutlineLoading3Quarters className="w-5 h-5 text-white animate-spin" />
            <p className="text-xl font-light text-white">Loading</p>
          </div>
        )} */}
      </div>
      {showPano && selectedBuilding && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center sm:p-5 ">
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
      {
        <div className="absolute flex flex-col justify-center my-auto rounded-full h-fit top-14 bottom-14 right-5">
          <div className="flex flex-col  p-0 rounded-full backdrop-blur-md bg-[#4A4640]/60">
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
        </div>
      }
    </main>
  );
}
