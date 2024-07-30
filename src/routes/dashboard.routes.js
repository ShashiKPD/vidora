import { Router } from 'express';
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/stats/:channelId").get(getChannelStats);
router.route("/videos/:channelId").get(getChannelVideos);

export default router