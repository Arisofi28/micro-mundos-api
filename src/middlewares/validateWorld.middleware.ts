import { RequestHandler } from "express";

import {
  CreateWorldInput,
  WORLD_CATEGORIES,
  WORLD_STATUSES,
  WorldCategory,
  WorldStatus,
} from "../models/world.model";

import { AppError } from "../utils/AppError";

const allowedFields:
  readonly (keyof CreateWorldInput)[] = [
    "name",
    "category",
    "energy",
    "status",
    "description",
    "inhabitants",
  ];

const isObject = (
  value: unknown
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

export const validateWorld: RequestHandler = (
  req,
  _res,
  next
) => {
  const body: unknown = req.body;

  if (!isObject(body)) {
    next(
      new AppError(
        400,
        "El cuerpo de la petición debe ser un objeto JSON."
      )
    );

    return;
  }

  const receivedFields =
    Object.keys(body);

  const unknownFields =
    receivedFields.filter(
      (field) =>
        !allowedFields.includes(
          field as keyof CreateWorldInput
        )
    );

  if (unknownFields.length > 0) {
    next(
      new AppError(
        400,
        `Campos no permitidos: ${unknownFields.join(", ")}.`
      )
    );

    return;
  }

  if (req.method === "POST") {
    const missingFields =
      allowedFields.filter(
        (field) =>
          body[field] === undefined
      );

    if (missingFields.length > 0) {
      next(
        new AppError(
          400,
          `Faltan campos obligatorios: ${missingFields.join(", ")}.`
        )
      );

      return;
    }
  }

  if (
    req.method === "PATCH" &&
    receivedFields.length === 0
  ) {
    next(
      new AppError(
        400,
        "Debes enviar al menos un campo para actualizar."
      )
    );

    return;
  }

  const {
    name,
    category,
    energy,
    status,
    description,
    inhabitants,
  } = body;

  if (
    name !== undefined &&
    (
      typeof name !== "string" ||
      name.trim() === ""
    )
  ) {
    next(
      new AppError(
        400,
        "name debe ser un texto no vacío."
      )
    );

    return;
  }

  if (
    category !== undefined &&
    (
      typeof category !== "string" ||
      !WORLD_CATEGORIES.includes(
        category as WorldCategory
      )
    )
  ) {
    next(
      new AppError(
        400,
        `category debe ser: ${WORLD_CATEGORIES.join(", ")}.`
      )
    );

    return;
  }

  if (
    energy !== undefined &&
    (
      typeof energy !== "number" ||
      !Number.isFinite(energy) ||
      energy < 0 ||
      energy > 100
    )
  ) {
    next(
      new AppError(
        400,
        "energy debe ser un número entre 0 y 100."
      )
    );

    return;
  }

  if (
    status !== undefined &&
    (
      typeof status !== "string" ||
      !WORLD_STATUSES.includes(
        status as WorldStatus
      )
    )
  ) {
    next(
      new AppError(
        400,
        `status debe ser: ${WORLD_STATUSES.join(", ")}.`
      )
    );

    return;
  }

  if (
    description !== undefined &&
    (
      typeof description !== "string" ||
      description.trim() === ""
    )
  ) {
    next(
      new AppError(
        400,
        "description debe ser un texto no vacío."
      )
    );

    return;
  }

  if (
    inhabitants !== undefined &&
    (
      typeof inhabitants !== "number" ||
      !Number.isInteger(inhabitants) ||
      inhabitants < 0
    )
  ) {
    next(
      new AppError(
        400,
        "inhabitants debe ser un número entero mayor o igual a 0."
      )
    );

    return;
  }

  next();
};