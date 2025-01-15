import express from "express";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";

let router = express.Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

export default router;
