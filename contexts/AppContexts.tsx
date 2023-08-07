import { Building } from "@/src/data";
import { CameraControls } from "@react-three/drei";
import {
  createContext,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { Vector3 } from "three";

export interface BuildingsPosition {
  name: string;
  position: Vector3;
}

// interface for all the values & functions
interface IUseAppContext {
  buildings: BuildingsPosition[];
  addToBuildingList: (b: BuildingsPosition) => void;
  cameraControlRef: MutableRefObject<CameraControls | null> | undefined;
  selectedBuilding: Building | null;
  setSelectedBuilding: (b: Building | null) => void;
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
  selectedBuilding: null,
  setSelectedBuilding: function (b: Building | null): void {
    throw new Error("Function not implemented.");
  },
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
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  const resetCameraPosition = new Vector3(0, 200, 100);

  /**
   * The function addToBuildingList adds a new building position to the existing list of buildings.
   * @param {BuildingsPosition} b - The parameter "b" is of type "BuildingsPosition".
   */
  function addToBuildingList(b: BuildingsPosition) {
    setBuildings([...buildings, b]);
  }

  /**
   * The function `focusOn` takes a name parameter, finds the position of a building with that name,
   * and adjusts the camera to focus on that position.
   * @param {string} name - The `name` parameter is a string that represents the name of a building.
   */
  function focusOn(name: string) {
    const position = buildings.find((b) => b.name === name)?.position;
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
    setSelectedBuilding(null);
  }

  // NOTE: return all the values & functions you want to export
  return {
    buildings,
    addToBuildingList,
    cameraControlRef,
    selectedBuilding,
    setSelectedBuilding,
    focusOn,
    focusOnPosition,
    resetCamera,
    resetCameraPosition,
  };
}
