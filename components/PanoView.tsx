import React, { FC, useEffect, useRef } from "react";

import { Viewer } from "@photo-sphere-viewer/core";
import {
  EquirectangularTilesAdapterConfig,
  EquirectangularTilesAdapter,
} from "@photo-sphere-viewer/equirectangular-tiles-adapter";

interface Props {
  buildingName: string;
}

export const PanoramaView: FC<Props> = ({ buildingName }) => {
  const sphereElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ac: EquirectangularTilesAdapterConfig = {
      baseBlur: true,
      showErrorTile: true,
    };

    const baseUrl =
      "https://res.cloudinary.com/dnuy6byev/image/upload/v1690108260/360";

    const spherePlayerInstance = new Viewer({
      adapter: [EquirectangularTilesAdapter, ac],
      container: sphereElementRef.current ?? "",
      navbar: ["zoom", "move"],
      panorama: {
        width: 8000,
        cols: 16,
        rows: 8,
        baseUrl: `${baseUrl}/${buildingName}/resize_${buildingName}.jpg`,
        tileUrl: (col: any, row: any) => {
          return `${baseUrl}/${buildingName}/tiles/${buildingName}_${col}_${row}.jpg`;
        },
      },
    });

    return () => {
      spherePlayerInstance.destroy();
    };
  }, [sphereElementRef, buildingName]);

  return (
    <div
      className={`w-full relative h-full animate-in fade-in zoom-in overflow-clip duration-300`}
    >
      <div ref={sphereElementRef} className="w-full h-full"></div>
    </div>
  );
};
