"use client";

import React, { FC, Suspense, useEffect, useState } from "react";

import {
  PerspectiveCamera,
  CameraControls,
  Grid,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import Building from "./Building";
import { buildingsData } from "@/src/data";
import { useAppContext } from "@/contexts/AppContexts";

interface Props {
  onBuildingClick: (name: string | null) => void;
}
export const City: FC<Props> = ({ onBuildingClick }) => {
  const { cameraControlRef: cameraRef } = useAppContext();

  const [camPos, setCamPos] = useState<[number, number, number]>([0, 100, 100]);

  function handleBuildingClick(
    building: Object3D,
    buildingName: string | null
  ) {
    const target = building;

    const rotation = cameraRef?.current?.camera.rotation;
    cameraRef?.current?.setLookAt(
      target.position.x + 100,
      target.position.y + 100,
      target.position.z + -100,
      target.position.x,
      target.position.y,
      target.position.z,
      true
    );
    rotation && cameraRef?.current?.camera.setRotationFromEuler(rotation);

    onBuildingClick(buildingName);
  }

  function resetCamera() {
    const rotation = cameraRef?.current?.camera.rotation;
    cameraRef?.current?.setLookAt(
      camPos[0],
      camPos[1],
      camPos[2],
      0,
      0,
      0,
      true
    );
    rotation && cameraRef?.current?.camera.setRotationFromEuler(rotation);
  }

  // useEffect(() => {
  //   cameraRef?.current?.setPosition(180, 100, 80);

  //   return () => {};
  // }, [cameraRef]);

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
      {buildingsData.map((b, i) => (
        <BuildingContainer
          key={i}
          buildingName={b.buildingName}
          handleBuildingClick={handleBuildingClick}
        />
      ))}

      {/* Helper pink cube */}
      <mesh onClick={resetCamera} position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>

      {/* Controls */}
      <PerspectiveCamera
        fov={40}
        makeDefault
        position={(camPos[0], camPos[1], camPos[2])}
      />

      <CameraControls
        enabled
        makeDefault
        ref={cameraRef}
        maxDistance={200}
        minDistance={300}
        maxPolarAngle={Math.PI / 2.5}
      />

      <TheGrid />

      <ambientLight />
      <directionalLight position={[10, 10, 10]} />
      <Environment preset="city" />
    </group>
  );
};

interface IBuildingContainer {
  buildingName: string;
  handleBuildingClick: (
    building: Object3D,
    buildingName: string | null
  ) => void;
}
function BuildingContainer({
  buildingName,
  handleBuildingClick,
}: IBuildingContainer) {
  return (
    <Suspense
      fallback={
        <Building
          name={buildingName}
          url={`/low/${buildingName}.glb`}
          onBuildingClick={(obj) => handleBuildingClick(obj, buildingName)}
        />
      }
    >
      <Building
        name={buildingName}
        url={`/high/${buildingName}.glb`}
        onBuildingClick={(obj) => handleBuildingClick(obj, buildingName)}
      />
    </Suspense>
  );
}
