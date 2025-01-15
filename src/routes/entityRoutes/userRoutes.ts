import express from "express";
import {
  deleteUser,
  fetchHomePageData,
  fetchUserDetails,
  fetchUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUserStatus,
  userAuth,
} from "../../controllers/entityControllers/userControllers/index";
import { adminAuthMiddleware } from "../../middlewares/validators/auth/adminAuthMiddleware";
import { userAuthMiddleware } from "../../middlewares/validators/auth/userAuthMiddleware";
import {
  booleanValidate,
  emailValidate,
  passwordValidate,
  stringValidate,
} from "../../middlewares/validators/fieldValidations";
import {
  basicPaginationHandler,
  validationHandler,
} from "../../middlewares/validators/validationHandler";

let router = express.Router();

// register user
router.post(
  "/register",
  [
    stringValidate("body", "name", false)!,
    emailValidate("body", "email", false)!,
    passwordValidate("body", "password", false)!,
  ],
  validationHandler,
  registerUser
);

// login user
router.post(
  "/login",
  [
    emailValidate("body", "email", false)!,
    passwordValidate("body", "password", false)!,
  ],
  validationHandler,
  loginUser
);

// user auth
router.get("/auth", userAuthMiddleware, userAuth);

// logout user
router.post("/logout", userAuthMiddleware, logoutUser);

router.get(
  "",
  [
    ...basicPaginationHandler(),
    booleanValidate("query", "status", true)!,
    stringValidate("query", "userId", true)!,
    stringValidate("query", "searchKey", true)!,
  ],
  validationHandler,
  adminAuthMiddleware,
  fetchUsers
);

router.get(
  "/details/:userId",
  [stringValidate("param", "userId", false)!],
  validationHandler,
  adminAuthMiddleware,
  fetchUserDetails
);

router.patch(
  "/status",
  [
    stringValidate("body", "userId", false)!,
    booleanValidate("body", "status", false)!,
  ],
  validationHandler,
  adminAuthMiddleware,
  updateUserStatus
);

router.delete(
  "",
  [stringValidate("body", "userId", false)!],
  validationHandler,
  adminAuthMiddleware,
  deleteUser
);

router.get(
  "/home",
  [stringValidate("query", "tag", true)!],
  validationHandler,
  userAuthMiddleware,
  fetchHomePageData
);

export default router;
