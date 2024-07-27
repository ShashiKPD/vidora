import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { checkHealth, deleteResource } from "../controllers/healthcheck.controller.js";

const router = Router()

router.route("/").get(checkHealth)
router.route("/delete").delete(verifyJwt, deleteResource)

export default router