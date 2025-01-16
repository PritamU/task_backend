// module imports
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import { sequelize } from "./src/config/databaseConfig";

// file imports
import { ErrorCodes } from "./src/constants/errorCodes";
import entityRoutes from "./src/routes/entityRoutes/index";
import metadataRoutes from "./src/routes/metadataRoutes/index";

let app = express();

//config
dotenv.config();
app.use(morgan("dev"));
const allowedOrigins = [process.env.CORS_DOMAIN];
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("origin", origin);
      let allowed = true;
      if (origin) {
        allowed = allowedOrigins.includes(origin);
      }
      // Check if the request's origin is in the allowed origins list
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "user.sid"], // Add any custom headers
    credentials: true,
  })
);
app.options("*", cors()); // Handle preflight requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send(`Hi! I am Currently Active!`);
  return;
});

app.use("/entity", entityRoutes);
app.use("/metadata", metadataRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Route Not Found");
  return next(createHttpError(ErrorCodes.not_found, "Route not Found!"));
});

// error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log("main error handler", error.message);
  res.status(error.status || 500).json({
    status: false,
    message: error.message,
  });
  return;
});

const port = process.env.PORT || 5050;

// Sync Database and Start Server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected and synced");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
