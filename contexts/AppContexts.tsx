// import { Building, Floor, Unit, buildingsData } from "@/src/data";
import { supabase } from "@/src/database/supabase";

import { CameraControls } from "@react-three/drei";
import {
  createContext,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Vector3 } from "three";

export interface BuildingsPosition {
  name: string;
  position: Vector3;
}

export interface Unit {
  id: string;
  buildingId: string;
  floors: string[];
  displayName: string;
  description: string | null;
  panoramaUrl: string | null;
  readmoreUrl: string | null;
  inquiryUrl: string | null;
  isrented: boolean;
  type: "shop" | "office";
}

// interface for all the values & functions
interface IUseAppContext {
  buildings: BuildingsPosition[];
  addToBuildingList: (b: BuildingsPosition) => void;
  cameraControlRef: MutableRefObject<CameraControls | null> | undefined;
  // selectedBuilding: Building | null;
  unitData: Unit[];
  // setSelectedBuilding: (b: Building | null) => void;
  selectedBuildingId: string | null;
  setSelectedBuildingId: (id: string | null) => void;
  selectedFloor: string | null;
  setSelectedFloor: (floor: string | null) => void;
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
  focusOn: (name: string) => void;
  focusOnPosition: (position: Vector3) => void;
  resetCamera: () => void;
  resetCameraPosition: Vector3;
}

// the default state for all the values & functions
const defaultState: IUseAppContext = {
  buildings: [],
  addToBuildingList: function (b: BuildingsPosition): void {
    throw new Error("Function not implemented.");
  },
  cameraControlRef: undefined,
  // selectedBuilding: null,
  // setSelectedBuilding: function (b: Building | null): void {
  //   throw new Error("Function not implemented.");
  // },
  focusOn: function (name: string): void {
    throw new Error("Function not implemented.");
  },
  focusOnPosition: function (position: Vector3): void {
    throw new Error("Function not implemented.");
  },
  resetCamera: function (): void {
    throw new Error("Function not implemented.");
  },
  resetCameraPosition: new Vector3(),
  selectedBuildingId: null,
  setSelectedBuildingId: function (id: string | null): void {
    throw new Error("Function not implemented.");
  },
  selectedFloor: null,
  setSelectedFloor: function (floor: string | null): void {
    throw new Error("Function not implemented.");
  },
  selectedUnit: null,
  setSelectedUnit: function (unit: Unit | null): void {
    throw new Error("Function not implemented.");
  },
  unitData: [],
};

// creating the app contexts
const AppContext = createContext<IUseAppContext>(defaultState);

// Access app values and functions with custom useAppContext hook
export const useAppContext = () => useContext(AppContext);

// The App provider to wrap the components that will use the context
export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const app = useProviderApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

//NOTE: declare vars and functions here
function useProviderApp() {
  const cameraControlRef = useRef<CameraControls | null>(null);
  const [buildings, setBuildings] = useState<BuildingsPosition[]>([]);

  const bb = buildings;

  const [unitData, setUnitData] = useState<Unit[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const resetCameraPosition = new Vector3(0, 200, 100);

  useEffect(() => {
    async function getData() {
      await supabase
        .from("unit")
        .select("*")
        .then((res) => {
          setUnitData(res.data as Unit[]);
        });
    }

    getData();

    return () => {};
  }, []);

  /**
   * The function addToBuildingList adds a new building position to the existing list of buildings.
   * @param {BuildingsPosition} b - The parameter "b" is of type "BuildingsPosition".
   */
  function addToBuildingList(b: BuildingsPosition) {
    buildings.push(b);
  }

  /**
   * The function `focusOn` takes a name parameter, finds the position of a building with that name,
   * and adjusts the camera to focus on that position.
   * @param {string} name - The `name` parameter is a string that represents the name of a building.
   */
  function focusOn(name: string) {
    // const sb = buildingsData.find((b) => b.buildingName === name);
    const position = buildings.find((b) => b.name === name)?.position;

    // setSelectedBuilding(sb ?? null);
    setSelectedBuildingId(name);
    setSelectedFloor(null);
    setSelectedUnit(null);
    position ? focusOnPosition(position) : resetCamera();
  }

  function focusOnPosition(position: Vector3) {
    const rotation = cameraControlRef?.current?.camera.rotation;
    cameraControlRef?.current?.setLookAt(
      position.x + 100,
      position.y + 100,
      position.z + -100,
      position.x,
      position.y - 20,
      position.z,
      true
    );
    rotation &&
      cameraControlRef?.current?.camera.setRotationFromEuler(rotation);
  }

  function resetCamera() {
    resetCameraPosition;
    cameraControlRef?.current?.setLookAt(
      resetCameraPosition.x,
      resetCameraPosition.y,
      resetCameraPosition.z,
      0,
      0,
      0,
      true
    );
    setSelectedBuildingId(null);
    setSelectedFloor(null);
    setSelectedUnit(null);
  }

  // NOTE: return all the values & functions you want to export
  return {
    buildings,
    addToBuildingList,
    cameraControlRef,
    unitData,
    selectedBuildingId,
    setSelectedBuildingId,
    selectedFloor,
    setSelectedFloor,
    selectedUnit,
    setSelectedUnit,
    focusOn,
    focusOnPosition,
    resetCamera,
    resetCameraPosition,
  };
}
