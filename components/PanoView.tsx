import React, { FC, useEffect, useRef } from "react";

import { Viewer } from "@photo-sphere-viewer/core";
import {
  EquirectangularTilesAdapterConfig,
  EquirectangularTilesAdapter,
} from "@photo-sphere-viewer/equirectangular-tiles-adapter";

interface Props {
  baseUrl: string;
}

export const PanoramaView: FC<Props> = ({ baseUrl }) => {
  const sphereElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ac: EquirectangularTilesAdapterConfig = {
      baseBlur: true,
      showErrorTile: true,
    };

    const spherePlayerInstance = new Viewer({
      adapter: [EquirectangularTilesAdapter, ac],
      container: sphereElementRef.current ?? "",
      navbar: ["zoom", "move"],
      panorama: {
        width: 8000,
        cols: 16,
        rows: 8,
        baseUrl: `${baseUrl}/small.jpg`,
        tileUrl: (col: any, row: any) => {
          return `${baseUrl}/tiles/row-${row + 1}-column-${col + 1}.jpg`;
        },
      },
    });

    return () => {
      spherePlayerInstance.destroy();
    };
  }, [sphereElementRef, baseUrl]);

  return (
    <div
      className={`w-full relative h-full animate-in fade-in zoom-in overflow-clip duration-300`}
    >
      <div ref={sphereElementRef} className="w-full h-full"></div>
    </div>
  );
};
