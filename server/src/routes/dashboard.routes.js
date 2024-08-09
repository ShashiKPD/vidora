import { Router } from 'express';
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJwt);

router.route("/stats/:channelUserName").get(getChannelStats);
router.route("/videos/:channelUserName").get(getChannelVideos);

export default router