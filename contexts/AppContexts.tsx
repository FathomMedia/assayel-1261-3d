import { supabase } from "@/src/database/supabase";
import { getSteps } from "@/src/utils";

import { CameraControls } from "@react-three/drei";
import { StepType, useTour } from "@reactour/tour";

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

export interface ISettings {
  id: string;
  inquiry_domain: string;
}
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
  position_x: number | null;
  position_y: number | null;
  position_z: number | null;
}

export interface ITenant {
  id: number;
  name: string | null;
  ar_name: string | null;
  floors: string[];
  building_id: string | null;
  opening_times: string | null;
  description: string | null;
  ar_description: string | null;
  logo_url: string | null;
  panorama_url: string | null;
  readmore_url: string | null;
  type: string | null;
}

export enum Language {
  ENG,
  ع,
}
export enum Floors {
  GR,
  F1,
  F2,
}

// interface for all the values & functions
interface IUseAppContext {
  cameraControlRef: MutableRefObject<CameraControls | null> | undefined;
  settings: ISettings | null;

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
  updateSelectedTenant: (tenant: ITenant) => void;
  focusOn: (name: string) => void;
  focusOnPosition: (position: Vector3) => void;
  resetCamera: () => void;
  resetCameraPosition: Vector3;
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

// the default state for all the values & functions
const defaultState: IUseAppContext = {
  settings: null,
  buildings: [],
  units: [],
  tenants: [],
  cameraControlRef: undefined,
  selectedBuildingId: null,
  selectedFloor: null,
  selectedUnit: null,
  selectedTenant: null,
  resetCameraPosition: new Vector3(),
  language: Language.ENG,
  focusOn: function (name: string): void {
    throw new Error("Function not implemented.");
  },
  focusOnPosition: function (position: Vector3): void {
    throw new Error("Function not implemented.");
  },
  resetCamera: function (): void {
    throw new Error("Function not implemented.");
  },
  setSelectedBuildingId: function (id: string | null): void {
    throw new Error("Function not implemented.");
  },
  setSelectedFloor: function (floor: string | null): void {
    throw new Error("Function not implemented.");
  },
  setSelectedUnit: function (unit: IUnit | null): void {
    throw new Error("Function not implemented.");
  },
  setSelectedTenant: function (tenant: ITenant | null): void {
    throw new Error("Function not implemented.");
  },
  setLanguage: function (language: Language): void {
    throw new Error("Function not implemented.");
  },
  toggleLanguage: function (): void {
    throw new Error("Function not implemented.");
  },
  updateSelectedTenant: function (tenant: ITenant): void {
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
  const resetCameraPosition = new Vector3(-50, 200, 250);
  const [language, setLanguage] = useState(Language.ENG);

  const [units, setUnits] = useState<IUnit[]>([]);
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<ITenant | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );

  const { setSteps, setIsOpen } = useTour();

  function openTour() {
    setIsOpen(true);
  }

  const openTourGuide = useRef(() => openTour());

  /* This code block is making API calls to retrieve data from the Supabase database
  and update the state variables `buildings`, `units`, and `tenants` with the
  fetched data. */
  useEffect(() => {
    /* This code block is making an API call to the Supabase database to retrieve a single record from
    the "settings" table. It uses the `from` method to specify the table name, the `select` method
    with "*" to select all columns, and the `single` method to retrieve a single record. */
    supabase
      .from("settings")
      .select("*")
      .single()
      .then((res) => {
        setSettings(res.data as ISettings);
      });

    /* This code block is making an API call to the Supabase database to retrieve all the data from the
    "buildings" table. It then sorts the data based on the "id" field in ascending order. Finally,
    it updates the state variable "buildings" with the fetched data. */
    supabase
      .from("buildings")
      .select("*")
      .then((res) => {
        const b = res.data as IBuilding[];
        b.sort((a, b) => a.id.localeCompare(b.id));
        setBuildings(b);
      });

    /* The code block is making an API call to the Supabase database to retrieve all the data from the
    "units" table where the "is_rented" field is false. It then updates the state variable "units"
    with the fetched data. */
    supabase
      .from("units")
      .select("*")
      .eq("is_rented", false)
      .then((res) => {
        setUnits(res.data as IUnit[]);
      });

    /* The code block is making an API call to the Supabase database to retrieve all the data from the
    "tenants" table where the "active" field is true and the "building_id" field is not equal to
    "null". */
    supabase
      .from("tenants")
      .select("*")
      .eq("active", true)
      .neq("building_id", "null")
      .then((res) => {
        const dataFromCall = res.data;
        if (dataFromCall) {
          const tempTenants: ITenant[] = dataFromCall as ITenant[];
          setTenants(tempTenants);
        }
      });

    return () => {};
  }, []);

  /**
   * The focusOn function selects a building based on its name, updates the selected building ID, and
   * focuses the camera on the building's position if it exists, otherwise it resets the camera.
   * @param {string} name - The `name` parameter is a string that represents the ID of a building.
   */
  function focusOn(name: string) {
    const b = buildings.find((b) => b.id === name);

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

  /**
   * The function focuses the camera on a specific position in a 3D space.
   * @param {Vector3} position - The `position` parameter is a `Vector3` object that represents the
   * position in 3D space. It has three properties: `x`, `y`, and `z`, which correspond to the x, y,
   * and z coordinates of the position respectively.
   */
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

  /**
   * The function resets the camera position, clears selected building, floor, unit, and tenant.
   */
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

  function toggleLanguage() {
    const toLang = language === Language.ENG ? Language.ع : Language.ENG;
    setLanguage(toLang);
    setSteps!(getSteps(toLang));
  }

  useEffect(() => {
    const hadTour = localStorage.getItem("hadTour") === "true";

    if (!hadTour) {
      openTourGuide.current();
      localStorage.setItem("hadTour", "true");
    }
    return () => {};
  }, []);

  function updateSelectedTenant(t: ITenant) {
    setSelectedTenant(t);
  }

  // NOTE: return all the values & functions you want to export
  return {
    settings,
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
    language,
    setLanguage,
    toggleLanguage,
    updateSelectedTenant,
  };
}
