import { IBuilding, useAppContext } from "@/contexts/AppContexts";
import { Text3D, useGLTF } from "@react-three/drei";
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
  const obj = useGLTF(url, true, true);
  const pointer = useGLTF("/buildings/map_pointer.glb");
  const textRef = useRef<Mesh>(null);

  const { selectedBuildingId } = useAppContext();

  const [hover, setHover] = useState(false);
  const meshRef = useRef<Mesh>(null);

  // rotation of the marker
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
    }
  });

  /**
   * The handleClick function calls the onBuildingClick function and stops the event from propagating
   * further.
   * @param event - The event parameter is of type ThreeEvent<MouseEvent>. This means that it is an
   * event object that is specific to the Three.js library and it represents a mouse event.
   */
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
      {
        <mesh>
          <primitive object={obj.scene} />
        </mesh>
      }
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
                (building.position_y ?? 0) + 25,
                building.position_z ?? 0
              )
            }
          />
        )
      }
      <Text3D
        ref={textRef}
        scale={4}
        position={
          new Vector3(
            (building.position_x ?? 0) - 5,
            (building.position_y ?? 0) + 15,
            building.position_z ?? 0
          )
        }
        font={"/fonts/Dax_Regular.json"}
      >
        {building.id}
        <meshStandardMaterial color={"#EF3D2F"} />
      </Text3D>
    </group>
  );
}
