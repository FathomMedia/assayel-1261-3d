import { useAppContext } from "@/contexts/AppContexts";
import { useGLTF } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Mesh } from "three";

interface IBuilding {
  id: string;
  url: string;
  onBuildingClick: () => void;
}

export default function Building({ id, url, onBuildingClick }: IBuilding) {
  const obj = useGLTF(url);

  const { selectedBuildingId } = useAppContext();

  const [hover, setHover] = useState(false);
  const meshRef = useRef<Mesh>(null!);

  // rotation of the marker
  // useFrame((state, delta) => {
  //   meshRef.current.rotation.y += delta;
  //   meshRef.current.rotation.x += delta;
  //   meshRef.current.rotation.z += delta;
  // });

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
        // <mesh
        //   ref={meshRef}
        //   position={[
        //     obj.scene.children[0].position.x,
        //     obj.scene.children[0].position.y + 20,
        //     obj.scene.children[0].position.z - 4,
        //   ]}
        // >
        //   <boxGeometry args={[3, 3, 3]} />
        //   <meshStandardMaterial
        //     color={hover || selectedBuildingId == id ? "hotpink" : "orange"}
        //   />
        // </mesh>
      }
    </group>
  );
}
