import React, { FC, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer
    ),
  {
    ssr: false,
  }
);

interface Props {
  panorama: string;
}

export const PanoramaView: FC<Props> = ({ panorama }) => {
  return (
    <div
      className={`w-full h-full animate-in fade-in zoom-in rounded-2xl overflow-clip duration-300`}
    >
      <ReactPhotoSphereViewer
        src={panorama}
        height="100%"
        width="100%"
        container={""}
      ></ReactPhotoSphereViewer>
    </div>
  );
};
