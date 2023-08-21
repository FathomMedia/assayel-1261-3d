import React, { FC, Suspense } from "react";

import {
  PerspectiveCamera,
  CameraControls,
  Grid,
  Environment,
  useGLTF,
  Lightformer,
  Float,
} from "@react-three/drei";
import Building from "./Building";
import { IBuilding, useAppContext } from "@/contexts/AppContexts";
import { Sky } from "@react-three/drei";
import { Vector3 } from "three";

interface Props {
  onBuildingClick: (building: IBuilding | null) => void;
}
export const City: FC<Props> = ({ onBuildingClick }) => {
  const {
    cameraControlRef: cameraRef,
    resetCameraPosition,
    buildings,
  } = useAppContext();

  const floorObj = useGLTF("/buildings/FloorGrid.glb");

  function handleBuildingClick(building: IBuilding | null) {
    onBuildingClick(building);
  }

  function TheGrid() {
    const gridConfig = {
      cellSize: 0.5,
      cellThickness: 0.5,
      cellColor: "#6f6f6f",
      sectionSize: 3,
      sectionThickness: 1,
      sectionColor: "#30C9F4",
      fadeDistance: 300,
      fadeStrength: 1,
      followCamera: false,
      infiniteGrid: true,
    };
    return (
      <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
    );
  }

  return (
    <group>
      {/* Buildings */}
      {buildings.map((b, i) => (
        <BuildingContainer
          key={i}
          building={b}
          handleBuildingClick={handleBuildingClick}
        />
      ))}

      {/* Controls */}
      <PerspectiveCamera fov={40} makeDefault position={resetCameraPosition} />

      <CameraControls
        enabled
        makeDefault
        ref={cameraRef}
        maxDistance={200}
        minDistance={300}
        maxPolarAngle={Math.PI / 2.5}
      />

      <primitive object={floorObj.scene} position={[0, -1, 0]} />
      {/* <TheGrid /> */}

      <ambientLight />
      <directionalLight position={[10, 10, 10]} />
      <Environment
        preset="apartment"
        near={1}
        far={1}
        resolution={256}
        blur={0.18}
        background
      />
    </group>
  );
};

interface IBuildingContainer {
  building: IBuilding;
  handleBuildingClick: (building: IBuilding) => void;
}
function BuildingContainer({
  building,
  handleBuildingClick,
}: IBuildingContainer) {
  const { selectedBuildingId } = useAppContext();
  return selectedBuildingId === building.id && building.glb_url ? (
    <Suspense
      fallback={
        building.lowpoly_glb_url && (
          <Building
            building={building}
            url={building.lowpoly_glb_url}
            onBuildingClick={() => handleBuildingClick(building)}
          />
        )
      }
    >
      {building.glb_url && (
        <Building
          building={building}
          url={building.glb_url}
          onBuildingClick={() => handleBuildingClick(building)}
        />
      )}
    </Suspense>
  ) : (
    building.lowpoly_glb_url && (
      <Building
        building={building}
        url={building.lowpoly_glb_url}
        onBuildingClick={() => handleBuildingClick(building)}
      />
    )
  );
}
