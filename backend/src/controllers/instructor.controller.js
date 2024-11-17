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
    const { user, accessToken, refreshToken, isExistingUser } = req;
  
    if (!user) {
      return new ApiError(400, "User creation failed");
    }
  
    try {
      // Only set cookies for manual signup (where tokens are generated)
      if (accessToken && refreshToken) {
        const options = {
          httpOnly: true,
          secure: true,

        };
  
        return res
          .status(isExistingUser ? 200 : 201)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(
            isExistingUser ? 200 : 201,
            user,
            isExistingUser ? "User logged in successfully" : "User created successfully"
          ));
      }
  
      // For Google OAuth (no tokens needed as auth is handled by Google)
      return res
        .status(isExistingUser ? 200 : 201)
        .json(new ApiResponse(
          isExistingUser ? 200 : 201,
          user,
          isExistingUser ? "User logged in successfully" : "User created successfully"
        ));
    } catch (error) {
      console.error("Signup response error:", error);
      return new ApiError(500, "An unexpected error occurred during signup");
    }
  });
  //done
const qualification= asyncHandler(async(req,res)=>{
    const user = req.user;
    const { 
    qualificationsToAdd = [], 
    qualificationsToUpdate = [], 
    qualificationsToDelete = [] 
  } = req.body;

  if (!user) {
    throw new ApiError(400, "Instructor verification failed");
  }

  try {
    // Validate input data structure
    if (!Array.isArray(qualificationsToAdd) || 
        !Array.isArray(qualificationsToUpdate) || 
        !Array.isArray(qualificationsToDelete)) {
      throw new ApiError(400, "Invalid data format. Expected arrays for add, update, and delete operations");
    }

    // Validation helper function
    const validateQualification = (qual, requireId = false) => {
      if (requireId && !qual.id) {
        throw new ApiError(400, "Qualification ID is required for update/delete operations");
      }
      if (!qual.title || !qual.institution || !qual.year) {
        throw new ApiError(400, "Each qualification must have title, institution, and year");
      }
      const currentYear = new Date().getFullYear();
      if (qual.year < 1900 || qual.year > currentYear) {
        throw new ApiError(400, `Year must be between 1900 and ${currentYear}`);
      }
    };

    // Validate all qualification objects
    qualificationsToAdd.forEach(qual => validateQualification(qual, false));
    qualificationsToUpdate.forEach(qual => validateQualification(qual, true));
    qualificationsToDelete.forEach(id => {
      if (!Number.isInteger(id)) {
        throw new ApiError(400, "Invalid qualification ID for deletion");
      }
    });

    // Perform all operations in a transaction
    const result = await amber.$transaction(async (prisma) => {
      // Verify ownership of qualifications being updated/deleted
      if (qualificationsToUpdate.length > 0 || qualificationsToDelete.length > 0) {
        const existingQuals = await amber.qualification.findMany({
          where: {
            instructorId: user.id,
            id: {
              in: [
                ...qualificationsToUpdate.map(q => q.id),
                ...qualificationsToDelete
              ]
            }
          },
          select: { id: true }
        });

        const existingIds = new Set(existingQuals.map(q => q.id));
        
        // Check if all qualifications belong to the instructor
        const invalidUpdateIds = qualificationsToUpdate
          .filter(q => !existingIds.has(q.id))
          .map(q => q.id);
          
        const invalidDeleteIds = qualificationsToDelete
          .filter(id => !existingIds.has(id));

        if (invalidUpdateIds.length > 0 || invalidDeleteIds.length > 0) {
          throw new ApiError(403, "Some qualifications do not belong to this instructor");
        }
      }

      // Handle deletions
      if (qualificationsToDelete.length > 0) {
        await amber.qualification.deleteMany({
          where: {
            id: { in: qualificationsToDelete },
            instructorId: user.id
          }
        });
      }

      // Handle updates
      const updatePromises = qualificationsToUpdate.map(qual => 
        prisma.qualification.update({
          where: {
            id: qual.id,
            instructorId: user.id
          },
          data: {
            title: qual.title,
            institution: qual.institution,
            year: qual.year
          }
        })
      );
      await Promise.all(updatePromises);

      // Handle additions
      if (qualificationsToAdd.length > 0) {
        await prisma.qualification.createMany({
          data: qualificationsToAdd.map(qual => ({
            title: qual.title,
            institution: qual.institution,
            year: qual.year,
            instructorId: user.id
          }))
        });
      }

      // Fetch all updated qualifications
      const updatedQualifications = await prisma.qualification.findMany({
        where: {
          instructorId: user.id
        },
        orderBy: {
          year: 'desc'
        }
      });

      return updatedQualifications;
    });

    return res.status(200).json(new ApiResponse(200, result, "Qualifications Updated Successfully"));

  } catch (error) {
    console.error("Error during qualification update:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "An unexpected error occurred while updating qualifications");
  }
})

const achievement=asyncHandler(async(req,res)=>{

})
  export {
    testing,
    signup,
    qualification,
    achievement
  }