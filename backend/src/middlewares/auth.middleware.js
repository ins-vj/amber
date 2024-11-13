import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "express-oauth2-jwt-bearer";
import jwks from "jwks-rsa"
import axios from "axios"
import { amber } from "../db/index.js";

// export const jwtCheck = auth({
//   audience: process.env.AUTH_AUDIENCE,
//   issuerBaseURL: process.env.AUTH_PROVIDER,
//   tokenSigningAlg: 'RS256'
// });

// const jwtCheck = auth({
//   audience: 'https://amberedu/',
//   issuerBaseURL: 'https://dev-1ks4p3yob5fx8pxs.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized request: Token not provided"));
  }

  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      const user = await amber.user.findUnique({
        where: { username: "johndoe123" },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        },
      });

      if (!user) {
        console.log("User not found in database");
        // Throw custom error if user is not found
        throw new ApiError(401, "User doesn't exist");
      }

      console.log("User found in database:", user);
      req.user = user; // Attach user to request object
      next();
    } catch (innerError) {
      console.error("Database lookup error:", innerError);
      if (innerError instanceof ApiError) {
        return next(innerError); // Pass along the custom error without rethrowing
      }
      return next(new ApiError(500, "An error occurred while fetching the user"));
    }
  } catch (outerError) {
    console.error("Token validation or outer error:", outerError);
    if (outerError instanceof ApiError) {
      return next(outerError); // Pass along any custom error
    }
    return next(new ApiError(401, "Invalid access token"));
  }
});

