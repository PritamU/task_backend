import express from "express";
import todoRoutes from "./todoRoutes";

let router = express.Router();

router.use("/task", todoRoutes);

export default router;
