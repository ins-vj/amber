import { Router } from "express";
import { 
    testing, 
    signup,
    qualification,
    achievement
} from "../controllers/instructor.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWTw,verifyJWTa,firstJWTw,firstJWTa} from "../middlewares/auth.insmiddleware.js";


const router = Router()

router.route("/web/testing").post(verifyJWTw,testing)
router.route("/app/testing").post(verifyJWTa,testing)
router.route("/web/signup").post(firstJWTw,signup)
router.route("/app/signup").post(firstJWTa,signup)
router.route("/web/qualification").put(verifyJWTw,qualification)
router.route("/app/qualification").put(verifyJWTa,qualification)
router.route("/web/achievement").put(verifyJWTw,achievement)
export default router