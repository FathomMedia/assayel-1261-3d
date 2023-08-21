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

export interface IUnit {
  id: string;
  building_id: string;
  floors: string[];
  tenants_id: string | null;
  description: string | null;
  details: string[] | null;
  type: string | null;
}

export interface IBuilding {
  id: string;
  lowpoly_glb_url: string | null;
  glb_url: string | null;
  position_x: number | null;
  position_y: number | null;
  position_z: number | null;
}

export interface ITenant {
  id: string;
  name: string;
  floors: string[];
  buildings: string[];
  opening_times: string | null;
  description: string | null;
  panorama_url: string | null;
  readmore_url: string | null;
  type: string | null;
}

// interface for all the values & functions
interface IUseAppContext {
  cameraControlRef: MutableRefObject<CameraControls | null> | undefined;
  units: IUnit[];
  buildings: IBuilding[];
  tenants: ITenant[];
  selectedBuildingId: string | null;
  setSelectedBuildingId: (id: string | null) => void;
  selectedFloor: string | null;
  setSelectedFloor: (floor: string | null) => void;
  selectedUnit: IUnit | null;
  setSelectedUnit: (unit: IUnit | null) => void;
  selectedTenant: ITenant | null;
  setSelectedTenant: (tenant: ITenant | null) => void;
  focusOn: (name: string) => void;
  focusOnPosition: (position: Vector3) => void;
  resetCamera: () => void;
  resetCameraPosition: Vector3;
}

// the default state for all the values & functions
const defaultState: IUseAppContext = {
  buildings: [],
  cameraControlRef: undefined,

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
  setSelectedUnit: function (unit: IUnit | null): void {
    throw new Error("Function not implemented.");
  },
  units: [],
  tenants: [],
  selectedTenant: null,
  setSelectedTenant: function (tenant: ITenant | null): void {
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

  const [units, setUnits] = useState<IUnit[]>([]);
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);

  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<ITenant | null>(null);

  const resetCameraPosition = new Vector3(100, 250, 200);

  useEffect(() => {
    supabase
      .from("buildings")
      .select("*")
      .then((res) => {
        const b = res.data as IBuilding[];
        b.sort((a, b) => a.id.localeCompare(b.id));
        setBuildings(b);
      });

    supabase
      .from("units")
      .select("*")
      .is("tenants_id", null)
      .then((res) => {
        setUnits(res.data as IUnit[]);
      });

    supabase
      .from("tenants")
      .select(
        `
      *,
      units (
        floors,
        building_id
      )
      `
      )
      .then((res) => {
        const dataFromCall = res.data;
        if (dataFromCall) {
          const tempTenants: ITenant[] = dataFromCall.map((d) => {
            const tempFloors = [...d.units.map((u: any) => u.floors)].flat();
            const tempBuildings = [...d.units.map((u: any) => u.building_id)];

            return {
              id: d.id,
              name: d.name,
              description: d.description,
              opening_times: d.opening_times,
              panorama_url: d.panorama_url,
              readmore_url: d.readmore_url,
              type: d.type,
              floors: Array.from(new Set(tempFloors)),
              buildings: Array.from(new Set(tempBuildings)),
            } as ITenant;
          });
          setTenants(tempTenants);
        }
      });

    return () => {};
  }, []);

  /**
   * The function `focusOn` takes a name parameter, finds the position of a building with that name,
   * and adjusts the camera to focus on that position.
   * @param {string} name - The `name` parameter is a string that represents the name of a building.
   */
  function focusOn(name: string) {
    // const sb = buildingsData.find((b) => b.buildingName === name);
    const b = buildings.find((b) => b.id === name);

    // setSelectedBuilding(sb ?? null);
    setSelectedBuildingId(name);
    setSelectedFloor(null);
    setSelectedUnit(null);
    setSelectedTenant(null);
    b
      ? focusOnPosition(
          new Vector3(b.position_x ?? 0, b.position_y ?? 0, b.position_z ?? 0)
        )
      : resetCamera();
  }

  function focusOnPosition(position: Vector3) {
    const rotation = cameraControlRef?.current?.camera.rotation;
    cameraControlRef?.current?.setLookAt(
      position.x - 80,
      position.y + 150,
      position.z + 150,
      position.x,
      position.y - 20,
      position.z,
      true
    );
    rotation &&
      cameraControlRef?.current?.camera.setRotationFromEuler(rotation);
  }

  function resetCamera() {
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
    setSelectedTenant(null);
  }

  // NOTE: return all the values & functions you want to export
  return {
    buildings,
    units,
    tenants,
    selectedTenant,
    setSelectedTenant,
    cameraControlRef,
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
