import {
  CreativeWorld,
  CreateWorldInput,
  UpdateWorldInput,
} from "../models/world.model";

let worlds: CreativeWorld[] = [
  {
    id: 1,
    name: "Ciudad Neblina",
    category: "ciudad",
    energy: 85,
    status: "activo",
    description:
      "Una ciudad flotante que aparece entre las nubes.",
    inhabitants: 1250,
  },
  {
    id: 2,
    name: "Bosque Susurro",
    category: "bosque",
    energy: 60,
    status: "dormido",
    description:
      "Un bosque cuyos árboles guardan recuerdos.",
    inhabitants: 430,
  },
  {
    id: 3,
    name: "Océano Prisma",
    category: "oceano",
    energy: 95,
    status: "inestable",
    description:
      "Un océano donde el agua cambia de color con las emociones.",
    inhabitants: 880,
  },
];

export const getAllWorlds = (): CreativeWorld[] => {
  return worlds;
};

export const getWorldById = (
  id: number
): CreativeWorld | undefined => {
  return worlds.find((world) => world.id === id);
};

export const createWorld = (
  data: CreateWorldInput
): CreativeWorld => {
  const newId =
    worlds.length > 0
      ? Math.max(...worlds.map((world) => world.id)) + 1
      : 1;

  const newWorld: CreativeWorld = {
    id: newId,
    ...data,
  };

  worlds.push(newWorld);

  return newWorld;
};

export const updateWorld = (
  id: number,
  data: UpdateWorldInput
): CreativeWorld | undefined => {
  const world = worlds.find(
    (item) => item.id === id
  );

  if (!world) {
    return undefined;
  }

  Object.assign(world, data);

  return world;
};

export const deleteWorld = (
  id: number
): boolean => {
  const originalLength = worlds.length;

  worlds = worlds.filter(
    (world) => world.id !== id
  );

  return worlds.length < originalLength;
};