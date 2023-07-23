import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function getAllFoldersInFolder(
  folderPath: string
): Promise<string[]> {
  try {
    const response = await cloudinary.api.sub_folders(folderPath, {
      type: "upload",
    });
    if (response && response.folders) {
      return response.folders.map((folder: any) => folder.name);
    }
    return [];
  } catch (error) {
    console.error("Error fetching folders from Cloudinary:", error);
    return [];
  }
}

const FOLDER_PATH = `360`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const folders = await getAllFoldersInFolder(FOLDER_PATH);
    return res.status(200).json({ folders });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
