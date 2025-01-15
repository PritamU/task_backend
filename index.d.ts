import "express";
import { JwtPayloadInterface } from "./src/types/entity/commonInterfaces";

declare module "express" {
  interface Request {
    user?: JwtPayloadInterface;
  }
}
