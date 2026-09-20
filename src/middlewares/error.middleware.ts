import {
  ErrorRequestHandler,
  RequestHandler,
} from "express";

import { AppError } from "../utils/AppError";

export const notFoundMiddleware:
  RequestHandler = (
    req,
    _res,
    next
  ) => {
    next(
      new AppError(
        404,
        `Ruta no encontrada: ${req.method} ${req.originalUrl}`
      )
    );
  };

export const errorMiddleware:
  ErrorRequestHandler = (
    err,
    _req,
    res,
    _next
  ) => {
    if (err instanceof AppError) {
      res.status(
        err.statusCode
      ).json({
        success: false,
        error: err.message,
      });

      return;
    }

    if (
      err instanceof SyntaxError &&
      "status" in err &&
      err.status === 400
    ) {
      res.status(400).json({
        success: false,
        error:
          "El JSON enviado no tiene un formato válido.",
      });

      return;
    }

    console.error(
      "Error no controlado:",
      err
    );

    res.status(500).json({
      success: false,
      error:
        "Error interno del servidor.",
    });
  };