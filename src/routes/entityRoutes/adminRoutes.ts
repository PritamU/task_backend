import express from "express";
import {
  adminAuth,
  adminLogin,
  adminLogout,
  createAdmin,
  deleteAdmin,
  editAdmin,
  fetchAdmins,
} from "../../controllers/entityControllers/adminControllers/index";
import { adminAuthMiddleware } from "../../middlewares/validators/auth/adminAuthMiddleware";
import {
  booleanValidate,
  passwordValidate,
  stringValidate,
} from "../../middlewares/validators/fieldValidations";
import {
  basicPaginationHandler,
  validationHandler,
} from "../../middlewares/validators/validationHandler";

let router = express.Router();

// create admin
router.post(
  "",
  [
    stringValidate("body", "name", false)!,
    stringValidate("body", "username", false)!,
    passwordValidate("body", "password", false)!,
    booleanValidate("body", "isPrimary", false)!,
  ],
  validationHandler,
  adminAuthMiddleware,
  createAdmin
);

// admin login
router.post(
  "/login",
  [
    stringValidate("body", "username", false)!,
    passwordValidate("body", "password", false)!,
  ],
  validationHandler,
  adminLogin
);

// admin auth
router.get("/auth", adminAuthMiddleware, adminAuth);

// admin logout
router.post("/logout", adminAuthMiddleware, adminLogout);

// fetch admins
router.get(
  "",
  [
    ...basicPaginationHandler(),
    booleanValidate("query", "status", true)!,
    booleanValidate("query", "isPrimary", true)!,
  ],
  validationHandler,
  adminAuthMiddleware,
  fetchAdmins
);

// update admin
router.patch(
  "",
  [
    stringValidate("body", "adminId", false)!,
    booleanValidate("body", "status", true)!,
    booleanValidate("body", "isPrimary", true)!,
  ],
  validationHandler,
  adminAuthMiddleware,
  editAdmin
);

// delete admin
router.delete(
  "",
  [stringValidate("body", "adminId", false)!],
  validationHandler,
  adminAuthMiddleware,
  deleteAdmin
);

export default router;
