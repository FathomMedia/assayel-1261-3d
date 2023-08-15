import { BuildingsPosition, useAppContext } from "@/contexts/AppContexts";
import { useGLTF, useProgress } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Object3D, Mesh } from "three";

interface IBuilding {
  url: string;
  name: string;
  onBuildingClick: () => void;
  addPosition: boolean;
}

export default function Building({
  url,
  onBuildingClick,
  name,
  addPosition,
}: IBuilding) {
  const obj = useGLTF(url);

  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const { addToBuildingList, selectedBuildingId } = useAppContext();

  const update = useRef((b: BuildingsPosition) => addToBuildingList(b));

  const [hover, setHover] = useState(false);
  const meshRef = useRef<Mesh>(null!);

  useEffect(() => {
    if (addPosition && isLoaded) {
      const o = {
        name: name.toUpperCase(),
        position: obj.scene.children[0].position,
      };
      update.current(o);
    }

    return () => {};
  }, [name, addPosition, isLoaded, obj]);

  // rotation of the marker
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.z += delta;
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
            obj.scene.children[0].position.x,
            obj.scene.children[0].position.y + 20,
            obj.scene.children[0].position.z - 4,
          ]}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial
            color={hover || selectedBuildingId == name ? "hotpink" : "orange"}
          />
        </mesh>
      }
    </group>
  );
}
