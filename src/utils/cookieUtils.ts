import { Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadInterface } from "../types/commonInterfaces";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "none" | "lax" | "strict" | false;
  maxAge: number;
  domain?: string;
  overwrite?: boolean;
}

export const setCookieHandler = (
  name: string,
  value: string,
  res: Response
) => {
  let isDev = process.env.APP_ENV === "dev" ? true : false;

  let expiryTime = 28 * 24 * 60 * 60 * 1000;

  if (name === "auth_session") {
    expiryTime = 5 * 60 * 60 * 1000;
  }

  const secureCookieOptions: CookieOptions = {
    maxAge: expiryTime,
    domain: process.env.COOKIE_DOMAIN,
    sameSite: isDev ? false : "none",
    secure: isDev ? false : true,
    httpOnly: isDev ? false : true,
  };

  res.cookie(name, value, secureCookieOptions);
};

export const generateJwtToken = (payload: JwtPayloadInterface) => {
  const JWT_TOKEN_SECRET: string = process.env.JWT_SECRET!; // telling ts that value of this string will never be null to avoid error.
  const iat = Math.floor(Date.now() / 1000);
  payload.exp = iat + 2630000;
  const token = jwt.sign(payload, JWT_TOKEN_SECRET);
  return token;
};
