export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  media?: string;
  download: boolean;
};

export type AssetType = "image" | "music/mp3" | "file" | "video" | "etc";
