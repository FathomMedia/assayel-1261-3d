export interface Building {
  id: string;
  cameraId: string;
  name: string;
  description: string;
  buildingName: string | null;
}

export const buildingsData: Building[] = [
  {
    // id: "978c52c9-1e06-4349-826c-aa81251206db",
    id: "cc2086fb-82c9-4303-b7b5-7b232fa1c6b7",
    cameraId: "4ef2ff6b-af48-46e7-8d54-4faa38d04051",
    name: "The mighty hotel",
    description:
      "This is the best hotel in town with free of charge service, we want you to be happy!",
    buildingName: "b1",
  },
  {
    id: "5baa6924-7c37-47d7-bb3f-1c6e505ed291",
    cameraId: "d0cb9205-4af3-4535-ad3a-bf669ac3159e",
    name: "The basic building",
    description: "This is just a place to sleep",
    buildingName: "b2",
  },
  {
    id: "4ef536c7-d152-4c9a-9cae-e9731a4222e4",
    cameraId: "7ad36e58-431f-4efb-b1a1-9b7bb140a7d9",
    name: "The school",
    description:
      "Beyond the classrooms, the school building houses a library filled with books of all genres, inviting students to explore new worlds and expand their knowledge. The library provides a tranquil retreat, with cozy reading nooks and study areas where students can delve into their studies or lose themselves in the pages of a captivating story. Adjoining the library is a well-equipped computer lab, where students can harness the power of technology for research, coding, and digital projects.",
    buildingName: "b3",
  },
];
