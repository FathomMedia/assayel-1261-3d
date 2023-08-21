import { IBuilding, useAppContext } from "@/contexts/AppContexts";
import { useGLTF } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";

interface IBuildingLocal {
  building: IBuilding;
  url: string;
  onBuildingClick: () => void;
}

export default function Building({
  building,
  url,
  onBuildingClick,
}: IBuildingLocal) {
  const obj = useGLTF(url);

  const { selectedBuildingId } = useAppContext();

  const [hover, setHover] = useState(false);
  const meshRef = useRef<Mesh>(null!);

  // rotation of the marker
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
    // meshRef.current.rotation.x += delta;
    // meshRef.current.rotation.z += delta;
  });

  function handleClick(event: ThreeEvent<MouseEvent>) {
    onBuildingClick();
    event.stopPropagation();
  }

  return (
    <group
      onClick={(event) => handleClick(event)}
      onPointerOver={(event) => (event.stopPropagation(), setHover(true))}
      onPointerOut={(event) => (event.stopPropagation(), setHover(false))}
    >
      <mesh>
        <primitive object={obj.scene} />
      </mesh>
      {
        // position of the marker
        <mesh
          ref={meshRef}
          position={[
            building.position_x ?? 0,
            (building.position_y ?? 0) + 15,
            (building.position_z ?? 0) - 4,
          ]}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial
            color={
              hover || selectedBuildingId == building.id ? "hotpink" : "orange"
            }
          />
        </mesh>
      }
    </group>
  );
}
