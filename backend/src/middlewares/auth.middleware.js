import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "express-oauth2-jwt-bearer";
import jwks from "jwks-rsa"
import axios from "axios"
import { amber } from "../db/index.js";

export const jwtCheck = auth({
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_PROVIDER,
  tokenSigningAlg: 'RS256'
});

// const jwtCheck = auth({
//   audience: 'https://amberedu/',
//   issuerBaseURL: 'https://dev-1ks4p3yob5fx8pxs.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(' ')[1];
    console.log(token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const response= await axios.get(process.env.AUTH_FETCH,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const userinfo=response.data;
    console.log(userinfo);

    // const user = await amber.user.findUnique({
    //   where: { id: decodedToken?.id },
    //   select: {
    //     id: true, 
    //     name: true,
    //     email: true,
    //     username:true,
    //   },
      
    // });

    // if (!user) {
    //   throw new ApiError(401, "Invalid Access Token");
    // }

     req.user = userinfo;
    next();
  } catch (error) {
    throw new ApiError(401, error?.response?.data?.error || "Invalid access token");
  }
});


