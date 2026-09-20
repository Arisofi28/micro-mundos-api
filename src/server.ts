import express from "express";

import worldRouter from "./routes/world.routes";

import {
  requestIdMiddleware,
} from "./middlewares/requestId.middleware";

import {
  loggerMiddleware,
} from "./middlewares/logger.middleware";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware";

const app = express();

const PORT =
  Number(process.env.PORT) ||
  3000;

app.disable("x-powered-by");

app.use(
  requestIdMiddleware
);

app.use(
  loggerMiddleware
);

app.use(
  express.json()
);

app.get(
  "/",
  (_req, res) => {
    res.status(200).json({
      success: true,
      name:
        "Micro-Mundos Creativos API",
      version: "1.0.0",
      message:
        "API funcionando correctamente.",
      endpoints:
        "/api/worlds",
    });
  }
);

app.use(
  "/api/worlds",
  worldRouter
);

app.use(
  notFoundMiddleware
);

app.use(
  errorMiddleware
);

app.listen(
  PORT,
  () => {
    console.log(
      `Micro-Mundos Creativos API ejecutándose en http://localhost:${PORT}`
    );
  }
);