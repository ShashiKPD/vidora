import { Router } from "express"
import { getCurrentUser, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser);

router.route("/login").post(loginUser);

// Protected Routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/currentuser").get(verifyJwt, getCurrentUser)
router.route("/refreshtoken").get(refreshAccessToken)
router.route("/watchHistory").get(verifyJwt, getWatchHistory)


export default router