export const WORLD_CATEGORIES = [
  "ciudad",
  "bosque",
  "oceano",
  "espacio",
] as const;

export const WORLD_STATUSES = [
  "activo",
  "dormido",
  "inestable",
] as const;

export type WorldCategory =
  (typeof WORLD_CATEGORIES)[number];

export type WorldStatus =
  (typeof WORLD_STATUSES)[number];

export interface CreativeWorld {
  id: number;
  name: string;
  category: WorldCategory;
  energy: number;
  status: WorldStatus;
  description: string;
  inhabitants: number;
}

export type CreateWorldInput =
  Omit<CreativeWorld, "id">;

export type UpdateWorldInput =
  Partial<CreateWorldInput>;