import React, { FC, useRef, useState } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ObjectMap, ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { BoxGeometry, Object3D, Vector3 } from "three";
import { PerspectiveCamera } from "@react-three/drei";

interface ICity {
  onBuildingClick: (buildingName: string, position: Vector3) => void;
  model: GLTF & ObjectMap;
}

const ThreeDModel: FC<ICity> = ({ onBuildingClick, model }) => {
  return (
    <group>
      {/* {model.scene.children.map((child, index) => (
        <Building obj={child} key={index} onBuildingClick={onBuildingClick} />
      ))} */}
    </group>
  );
};

export default ThreeDModel;
