import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { checkHealth, compressImage, deleteResource } from "../controllers/healthcheck.controller.js";

const router = Router()

router.route("/").get(checkHealth)
router.route("/delete").delete(verifyJwt, deleteResource)
router.route("/compress/image").post(upload.single("image"), compressImage)

export default router