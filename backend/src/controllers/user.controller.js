import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import zod from "zod"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import {amber} from "../db/index.js";
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';



const testing=asyncHandler(async(req,res)=>{
    const user=req.user;
    return res.status(201).json(
        new ApiResponse(200,user, "User Registered Successfully")
    )
})//done

const signup = asyncHandler(async (req, res) => {
    const user = req.user;
    const accessToken=req.accessToken;
    const refreshToken=req.refreshToken 
    if (!user) {
      return next(new ApiError(400, "User creation failed"));
    }
    if(!accessToken){
    try {
      return res.status(201).json( new ApiResponse(201,user,"User created successfully")
      );
  
    } catch (error) {
      console.error("Error during signup process:", error);
      if (error instanceof ApiError) {
        return next(error);
      }
      return next(new ApiError(500, "An unexpected error occurred during signup"));
    }}
    else if(accessToken){
        try {
            const options = {
                httpOnly: true,
                secure: true
            }
            
            return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json( new ApiResponse(201,user,"User created successfully")
            );
        
          } catch (error) {
            console.error("Error during signup process:", error);
            if (error instanceof ApiError) {
              return next(error);
            }
            return next(new ApiError(500, "An unexpected error occurred during signup"));
          }
    }
  });//done
  
const education= asyncHandler(async(req,res)=>{
    const { name, email, role } = req.body;;
    if (!user) {
      return next(new ApiError(400, "User creation failed"));
    }
    
        try {
            const options = {
                httpOnly: true,
                secure: true
            }
            
            return res
            .status(201)
            .json( new ApiResponse(201,user,"User Eduction Saved Successfully")
            );
        
          } catch (error) {
            console.error("Error during updation:", error);
            if (error instanceof ApiError) {
              return next(error);
            }
            return next(new ApiError(500, "An unexpected error occurred during signup"));
          }
    
})

const getUserProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    try {
        const user = await amber.user.findUnique({
          where: {
            username: username
          },
          select: {
            username: true,
            profilepicture: true
          }
        });
    
        // Check if user exists
        if (!user) {
          return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }
    
        // Send success response if user is found
        return res
            .status(200)
            .json(
            new ApiResponse(200, user, 'User profile fetched successfully')
        );
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // Handle any server errors
        return res.status(500).json(
          new ApiResponse(500, null, 'An error occurred while fetching user profile')
        );
      }
})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, pass} = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    const user = await amber.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email }
          ]
        },
      });
      

    if (!user) {
        throw new ApiError(404, "User does not exist sign up first")
    }

    const is_pass= await bcrypt.compare(pass,user.password);

   if (!is_pass) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user.id)

    const loggedInUser = await amber.user.findUnique({
        where:{
            id:user.id
        },
        omit:{
            password:true,
            refresh_token:true
        }
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const logoutUser = asyncHandler(async(req, res) => {
    try {
        // Update the user and set refreshToken to null
        const updatedUser = await amber.user.update({
          where: 
          { id: req.user.id },
          data: 
          { refreshToken: null },
        });
    
        // Cookie options for secure and httpOnly cookies
        const options = {
          httpOnly: true,
          secure: true,
        };
    
        // Clear cookies and return response
        return res
          .status(200)
          .clearCookie('accessToken', options)
          .clearCookie('refreshToken', options)
          .json(new ApiResponse(200, {}, 'User logged out'));
      } catch (error) {
        console.error('Logout failed:', error);
        return res.status(500).json(new ApiResponse(500, {}, 'Logout failed'));
      }
})

const editProfile=asyncHandler(async(req,res)=>{
    
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})


const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


export {
    testing,
    signup,
    education,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserProfile,
    getWatchHistory
}