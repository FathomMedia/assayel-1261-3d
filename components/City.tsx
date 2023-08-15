import React, { FC, Suspense } from "react";

import {
  PerspectiveCamera,
  CameraControls,
  Grid,
  Environment,
  useGLTF,
} from "@react-three/drei";
import Building from "./Building";
import { useAppContext } from "@/contexts/AppContexts";

interface Props {
  onBuildingClick: (name: string | null) => void;
}
export const City: FC<Props> = ({ onBuildingClick }) => {
  const { cameraControlRef: cameraRef, resetCameraPosition } = useAppContext();

  const floorObj = useGLTF("/buildings/FloorGrid.glb");

  function handleBuildingClick(buildingName: string | null) {
    onBuildingClick(buildingName?.toUpperCase() ?? null);
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
      {["B10", "B11", "B12"].map((b, i) => (
        <BuildingContainer
          key={i}
          buildingName={b}
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
      <Environment preset="city" />
    </group>
  );
};

interface IBuildingContainer {
  buildingName: string;
  handleBuildingClick: (buildingName: string | null) => void;
}
function BuildingContainer({
  buildingName,
  handleBuildingClick,
}: IBuildingContainer) {
  return (
    <Suspense
      fallback={
        <Building
          addPosition={false}
          name={buildingName}
          url={`/buildings/low/${buildingName.toLowerCase()}.glb`}
          onBuildingClick={() => handleBuildingClick(buildingName)}
        />
      }
    >
      <Building
        addPosition={true}
        name={buildingName}
        url={`/buildings/high/${buildingName.toLowerCase()}.glb`}
        onBuildingClick={() => handleBuildingClick(buildingName)}
      />
    </Suspense>
  );
}
