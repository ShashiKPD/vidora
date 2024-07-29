import { Router } from 'express';
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  togglecommunityPostLike,
} from "../controllers/like.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJwt);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/cp/:communityPostId").post(togglecommunityPostLike);
router.route("/videos").get(getLikedVideos);

export default router