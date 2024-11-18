import { Router } from "express";
import { 
    testing, 
    signup,
    qualification,
    achievement,
    createCourse,
    updateCourse,
    dashboard,
    uploadpic
} from "../controllers/instructor.controller.js";
import {upload}from "../middlewares/multer.middleware.js";
import { verifyJWTw,verifyJWTa,firstJWTw,firstJWTa} from "../middlewares/auth.insmiddleware.js";




const router = Router()

router.route("/web/testing").post(verifyJWTw,testing)
router.route("/app/testing").post(verifyJWTa,testing)
router.route("/web/signup").post(firstJWTw,signup)
router.route("/app/signup").post(firstJWTa,signup)
router.route("/web/qualification").put(verifyJWTw,qualification)
router.route("/app/qualification").put(verifyJWTa,qualification)
router.route("/web/achievement").put(verifyJWTw,achievement)
router.route("/app/qualification").put(verifyJWTa,achievement)
router.route("/web/dashboard").get(verifyJWTw,dashboard)
router.route("/app/dashboard").get(verifyJWTa,dashboard)
router.route("/web/uploadpic").patch(verifyJWTw,upload.single("profilePicture"),uploadpic)
router.route("/app/uploadpic").patch(verifyJWTa,upload.single("profilePicture"),uploadpic)
router.route("/web/createcourse").post(verifyJWTw,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),createCourse) //add upload middleware
router.route("/app/createcourse").post(verifyJWTa,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),createCourse)
router.route("/web/updateCourse/:courseId").put(verifyJWTw,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),updateCourse)  
router.route("/app/updateCourse/:courseId").put(verifyJWTa,upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'introvideo', maxCount: 1 },
    { name: 'sectionVideos', maxCount: 10 } // Adjust maxCount based on your needs
  ]),updateCourse)   
export default router