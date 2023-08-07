export interface Building {
  buildingName: string;
  name: string;
  description: string;
}

export const buildingsData: Building[] = [
  {
    buildingName: "b1",
    name: "The mighty hotel",
    description:
      "This is the best hotel in town with free of charge service, we want you to be happy!",
  },
  {
    buildingName: "b2",
    name: "The basic building",
    description: "This is just a place to sleep",
  },
  {
    buildingName: "b3",
    name: "The school",
    description:
      "Beyond the classrooms, the school building houses a library filled with books of all genres, inviting students to explore new worlds and expand their knowledge. The library provides a tranquil retreat, with cozy reading nooks and study areas where students can delve into their studies or lose themselves in the pages of a captivating story. Adjoining the library is a well-equipped computer lab, where students can harness the power of technology for research, coding, and digital projects.",
  },
];
