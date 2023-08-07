import { useFrame, ThreeEvent } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Object3D, Vector3 } from "three";

export default function Building({ obj, onBuildingClick }: IBuilding) {
  const [hover, setHover] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.z += delta;
  });

  function handleClick(
    event: ThreeEvent<MouseEvent>,
    name: string,
    position: Vector3
  ) {
    onBuildingClick(name, obj.position);
    event.stopPropagation();
  }

  return (
    <group
      onClick={(event) => handleClick(event, obj.name, obj.position)}
      onPointerOver={(event) => (event.stopPropagation(), setHover(true))}
      onPointerOut={(event) => (event.stopPropagation(), setHover(false))}
    >
      <mesh>
        <primitive object={obj} />
      </mesh>
      {
        <mesh
          ref={meshRef}
          position={[obj.position.x, obj.position.y + 20, obj.position.z - 4]}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color={hover ? "hotpink" : "orange"} />
        </mesh>
      }
    </group>
  );
}

interface IBuilding {
  obj: Object3D;
  onBuildingClick: (buildingName: string, position: Vector3) => void;
}
