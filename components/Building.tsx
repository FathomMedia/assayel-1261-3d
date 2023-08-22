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
  const pointer = useGLTF("/buildings/map_pointer.glb");

  const { selectedBuildingId } = useAppContext();

  const [hover, setHover] = useState(false);
  const meshRef = useRef<Mesh>(null);

  // rotation of the marker
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  function handleClick(event: ThreeEvent<MouseEvent>) {
    console.log(obj.scene.children[0].position);
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
        selectedBuildingId === building.id && (
          <primitive
            ref={meshRef}
            object={pointer.scene}
            scale={2}
            position={
              new Vector3(
                building.position_x ?? 0,
                (building.position_y ?? 0) + 15,
                building.position_z ?? 0
              )
            }
          />
        )
      }
    </group>
  );
}
