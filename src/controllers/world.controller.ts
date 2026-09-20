import { RequestHandler } from "express";

import {
  createWorld,
  deleteWorld,
  getAllWorlds,
  getWorldById,
  updateWorld,
} from "../services/world.service";

import {
  CreateWorldInput,
  UpdateWorldInput,
} from "../models/world.model";

import { AppError } from "../utils/AppError";

const parseWorldId = (
  value: string | string[] | undefined
): number => {
  if (typeof value !== "string") {
    throw new AppError(
      400,
      "El id debe ser un número entero positivo."
    );
  }

  const id = Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new AppError(
      400,
      "El id debe ser un número entero positivo."
    );
  }

  return id;
};

export const listWorlds:
  RequestHandler = (
    _req,
    res
  ) => {
    const worlds =
      getAllWorlds();

    res.status(200).json({
      success: true,
      count: worlds.length,
      data: worlds,
    });
  };

export const getWorld:
  RequestHandler = (
    req,
    res,
    next
  ) => {
    try {
      const id =
        parseWorldId(
          req.params.id
        );

      const world =
        getWorldById(id);

      if (!world) {
        throw new AppError(
          404,
          `No existe un mundo con id ${id}.`
        );
      }

      res.status(200).json({
        success: true,
        data: world,
      });
    } catch (error) {
      next(error);
    }
  };

export const addWorld:
  RequestHandler = (
    req,
    res,
    next
  ) => {
    try {
      const input =
        req.body as CreateWorldInput;

      const world =
        createWorld(input);

      res.status(201).json({
        success: true,
        message:
          "Mundo creado correctamente.",
        data: world,
      });
    } catch (error) {
      next(error);
    }
  };

export const editWorld:
  RequestHandler = (
    req,
    res,
    next
  ) => {
    try {
      const id =
        parseWorldId(
          req.params.id
        );

      const input =
        req.body as UpdateWorldInput;

      const world =
        updateWorld(
          id,
          input
        );

      if (!world) {
        throw new AppError(
          404,
          `No existe un mundo con id ${id}.`
        );
      }

      res.status(200).json({
        success: true,
        message:
          "Mundo actualizado correctamente.",
        data: world,
      });
    } catch (error) {
      next(error);
    }
  };

export const removeWorld:
  RequestHandler = (
    req,
    res,
    next
  ) => {
    try {
      const id =
        parseWorldId(
          req.params.id
        );

      const deleted =
        deleteWorld(id);

      if (!deleted) {
        throw new AppError(
          404,
          `No existe un mundo con id ${id}.`
        );
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };