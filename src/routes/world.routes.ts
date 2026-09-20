import { Router } from "express";

import {
  addWorld,
  editWorld,
  getWorld,
  listWorlds,
  removeWorld,
} from "../controllers/world.controller";

import {
  validateWorld,
} from "../middlewares/validateWorld.middleware";

const worldRouter = Router();

worldRouter.get(
  "/",
  listWorlds
);

worldRouter.get(
  "/:id",
  getWorld
);

worldRouter.post(
  "/",
  validateWorld,
  addWorld
);

worldRouter.patch(
  "/:id",
  validateWorld,
  editWorld
);

worldRouter.delete(
  "/:id",
  removeWorld
);

export default worldRouter;