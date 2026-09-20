import { RequestHandler } from "express";

export const loggerMiddleware: RequestHandler = (
  req,
  res,
  next
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration =
      Date.now() - start;

    console.log(
      `[${res.locals.requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};