import { Building } from "@/src/data";
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

// interface for all the values & functions
interface IUseAppContext {
  buildings: BuildingsPosition[];
  addToBuildingList: (b: BuildingsPosition) => void;
  cameraControlRef: MutableRefObject<CameraControls | null> | undefined;
  selectedBuilding: Building | null;
  setSelectedBuilding: (b: Building | null) => void;
  focusOn: (name: string) => void;
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

  function addToBuildingList(b: BuildingsPosition) {
    setBuildings([...buildings, b]);
  }

  function focusOn(name: string) {
    const position =
      buildings.find((b) => b.name === name)?.position ?? new Vector3(0, 0, 0);

    const rotation = cameraControlRef?.current?.camera.rotation;
    cameraControlRef?.current?.setLookAt(
      position.x + 100,
      position.y + 100,
      position.z + -100,
      position.x,
      position.y,
      position.z,
      true
    );
    rotation &&
      cameraControlRef?.current?.camera.setRotationFromEuler(rotation);
  }

  // NOTE: return all the values & functions you want to export
  return {
    buildings,
    addToBuildingList,
    cameraControlRef,
    selectedBuilding,
    setSelectedBuilding,
    focusOn,
  };
}
