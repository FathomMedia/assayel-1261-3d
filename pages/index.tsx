import { Inter } from "next/font/google";
import Spline, { SPEObject, SplineEvent } from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";
import { MutableRefObject, Ref, useRef, useState } from "react";
import { Building, buildingsData } from "@/src/data";
import { BuildingCard } from "@/components/buildingCard";
import { ListOfBuildings } from "@/components/ListOfBuildings";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const splineRef = useRef<Application>();

  const defaultCameraId = "3B695796-4617-4F45-BF86-E0B33A41DF6B";
  const defaultCamera = useRef<SPEObject | undefined>();

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  const [isLoaded, setIsLoaded] = useState(false);

  function onLoad(spline: Application) {
    splineRef.current = spline;
    findObject(spline, defaultCameraId, defaultCamera);
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
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

  function focusOnBuilding(building: Building) {
    splineRef.current?.emitEvent("mouseDown", building.cameraId);
    setSelectedBuilding(building);
  }

  return (
    <main className={`flex h-screen flex-col items-center justify-between`}>
      <div className="relative w-full h-full rounded-2xl overflow-clip">
        <Spline
          className="w-full h-full"
          onLoad={onLoad}
          onMouseDown={onMouseDown}
          scene="https://prod.spline.design/EfGfaXj5QgqH7co7/scene.splinecode"
        />
        {isLoaded && (
          <div className="absolute left-0 right-0 flex flex-col items-end justify-end gap-5 px-5 md:flex-row bottom-5">
            {
              <div className="flex w-full overflow-x-scroll border rounded-lg grow border-slate-500">
                {selectedBuilding ? (
                  <BuildingCard building={selectedBuilding}></BuildingCard>
                ) : (
                  <div className="flex p-3 duration-300 grow animate-in slide-in-from-left-20">
                    <ListOfBuildings
                      buildings={buildingsData}
                      onClickBuilding={focusOnBuilding}
                    ></ListOfBuildings>
                  </div>
                )}
              </div>
            }
            {selectedBuilding && (
              <button
                className="w-full px-3 py-2 text-white bg-blue-500 rounded-lg md:w-auto h-fit min-w-fit"
                onClick={resetCamera}
              >
                Mall Camera
              </button>
            )}
          </div>
        )}
        {!isLoaded && (
          <div className="absolute top-0 bottom-0 left-0 right-0 animate-pulse bg-green-950"></div>
        )}
      </div>
    </main>
  );
}
