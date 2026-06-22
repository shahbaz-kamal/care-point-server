import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key Error";
      error = err.meta;
      statusCode = httpStatus.CONFLICT;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    (message = "Validation Error"), (error = err.message);
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    (message = "Unknown Prisma Error Occured"), (error = err.message);
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    (message = "Prisma Client Failed To initialized"), (error = err.message);
  }
  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
