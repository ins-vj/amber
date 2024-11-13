import { Router } from "express";
import { 
    testing,
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserProfile, 
    getWatchHistory, 
    updateAccountDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/testing").post(verifyJWT,testing)
router.route("/:username").get( getUserProfile)
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
    registerUser
    )
router.route("/login").post(loginUser)
router.route("/logout").post( logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post( changeCurrentPassword)
router.route("/current-user").get( getCurrentUser)
router.route("/update-account").patch(updateAccountDetails)

router.route("/avatar").patch( upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch( upload.single("coverImage"), updateUserCoverImage)

router.route("/history").get( getWatchHistory)

export default router