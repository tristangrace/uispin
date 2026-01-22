import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DESIGNS_DIR = path.resolve(__dirname, "../../designs");
const IMAGES_DIR = path.join(DESIGNS_DIR, "images");
const METADATA_FILE = path.join(DESIGNS_DIR, "metadata.json");

export interface Design {
  id: string;
  prompt: string;
  createdAt: string;
  images: string[];
}

interface Metadata {
  designs: Design[];
}

async function ensureDirectories(): Promise<void> {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

async function readMetadata(): Promise<Metadata> {
  try {
    const data = await fs.readFile(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { designs: [] };
  }
}

async function writeMetadata(metadata: Metadata): Promise<void> {
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filepath, buffer);
}

export async function saveDesign(
  prompt: string,
  imageUrls: string[]
): Promise<Design> {
  await ensureDirectories();

  const id = crypto.randomUUID().slice(0, 8);
  const imagePaths: string[] = [];

  // Download all images in parallel
  await Promise.all(
    imageUrls.map(async (url, index) => {
      const filename = `${id}-${index}.png`;
      const filepath = path.join(IMAGES_DIR, filename);
      await downloadImage(url, filepath);
      imagePaths.push(`/designs/images/${filename}`);
    })
  );

  const design: Design = {
    id,
    prompt,
    createdAt: new Date().toISOString(),
    images: imagePaths,
  };

  const metadata = await readMetadata();
  metadata.designs.unshift(design); // Add to beginning (newest first)
  await writeMetadata(metadata);

  return design;
}

export interface Base64Image {
  base64: string;
  mimeType: string;
}

export async function saveDesignFromBase64(
  prompt: string,
  images: Base64Image[]
): Promise<Design> {
  await ensureDirectories();

  const id = crypto.randomUUID().slice(0, 8);
  const imagePaths: string[] = [];

  // Save all base64 images in parallel
  await Promise.all(
    images.map(async (img, index) => {
      const ext = img.mimeType.split("/")[1] || "png";
      const filename = `${id}-${index}.${ext}`;
      const filepath = path.join(IMAGES_DIR, filename);
      const buffer = Buffer.from(img.base64, "base64");
      await fs.writeFile(filepath, buffer);
      imagePaths.push(`/designs/images/${filename}`);
    })
  );

  const design: Design = {
    id,
    prompt,
    createdAt: new Date().toISOString(),
    images: imagePaths,
  };

  const metadata = await readMetadata();
  metadata.designs.unshift(design);
  await writeMetadata(metadata);

  return design;
}

export async function getDesigns(): Promise<Design[]> {
  const metadata = await readMetadata();
  return metadata.designs;
}

export async function getDesignById(id: string): Promise<Design | null> {
  const metadata = await readMetadata();
  return metadata.designs.find((d) => d.id === id) || null;
}
