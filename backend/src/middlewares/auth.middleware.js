import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "express-oauth2-jwt-bearer";
import jwks from "jwks-rsa"
import axios from "axios"
import { amber } from "../db/index.js";
import bcrypt from "bcrypt"
import { generateAccessToken,generateRefreshToken } from "../utils/token.js";

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

const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await amber.user.findUnique({
          where: {
              id: userId,
            }, 
      })
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: refreshToken },
      });

      console.log("updated referesh token : " , updatedUser )

      return {accessToken, refreshToken}

  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

export const firstJWTw=asyncHandler(async(req,res,next)=>{
  const token = req.cookies?.accessToken || req.header("Authorization")?.split(' ')[1];
  const { name, email, password } = req.body; 

  if (token) {
  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH_WEB, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      let user_temp = await amber.user.findUnique({
        where: { email: userinfo.email },
        select: {
            id:true,
            name :true,       
            username  :true,     
            email : true,          
            profilepicture :true ,
            createdAt      :true,
            updatedAt      :true 
        },
      });

      if(!user_temp){
      let user = await amber.user.create({
        data: {
          name: userinfo.given_name,
          username: userinfo.nickname,
          email: userinfo.email,
          profilepicture: userinfo.picture,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select:{
          id:true,
          name :true,       
          username  :true,     
          email : true,          
          profilepicture :true ,
          createdAt      :true,
          updatedAt      :true 
        }
      });
      req.user = user; // Attach user to request object
      next();}
    } catch (innerError) {
      console.error("Database lookup error:", innerError);
      if (innerError instanceof ApiError) {
        return next(innerError); // Pass along the custom error without rethrowing
      }
      return next(new ApiError(500, "An error occurred while creating the user"));
    }}
   catch (outerError) {
    console.error("Token validation or outer error:", outerError);
    if (outerError instanceof ApiError) {
      return next(outerError); // Pass along any custom error
    }
    return next(new ApiError(401, "Invalid access token"));
  }}
  else if (name && email && password) {
    try {
      const userExists = await amber.user.findUnique({ where: { email } });
      
      if (userExists) {
        return next(new ApiError(409, "User with this email already exists"));
      }

      const hashedPassword = await bcrypt.hash(password, 5);

      try { 
        const user = await amber.user.create({
          data: {
            username: name,
            email: email,
            password:hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          select:{
            id:true,
            name :true,       
            username  :true,     
            email : true,          
            profilepicture :true ,
            createdAt      :true,
            updatedAt      :true 
          }
        });

        const{accessToken,refreshToken}= await generateAccessAndRefereshTokens(user.id)

        req.user = user; // Attach user to request object
        req.accessToken=accessToken;
        req.refreshToken=refreshToken;
        next();
      } catch (innerError) {
        console.error("Database lookup error:", innerError);
        if (innerError instanceof ApiError) {
          return next(innerError); // Pass along the custom error without rethrowing
        }
        return next(new ApiError(500, "An error occurred while creating the user"));
      }}
     catch (outerError) {
      console.error("Token validation or outer error:", outerError);
      if (outerError instanceof ApiError) {
        return next(outerError); // Pass along any custom error
      }
      return next(new ApiError(401, "Invalid Credentials"));
    }}
    else {
      return next(new ApiError(400, "Missing required fields or token"));
    }  
})


export const firstJWTa=asyncHandler(async(req,res,next)=>{
  const token = req.cookies?.accessToken || req.header("Authorization")?.split(' ')[1];
  const { name, email, password } = req.body; 

  if (token) {
  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH_APP, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      let user_temp = await amber.user.findUnique({
        where: { email: userinfo.email },
        select: {
            id:true,
            name :true,       
            username  :true,     
            email : true,          
            profilepicture :true ,
            createdAt      :true,
            updatedAt      :true 
        },
      });

      if(!user_temp){
      let user = await amber.user.create({
        data: {
          name: userinfo.given_name,
          username: userinfo.nickname,
          email: userinfo.email,
          profilepicture: userinfo.picture,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select:{
          id:true,
          name :true,       
          username  :true,     
          email : true,          
          profilepicture :true ,
          createdAt      :true,
          updatedAt      :true 
        }
      });
      req.user = user; // Attach user to request object
      next();}
    } catch (innerError) {
      console.error("Database lookup error:", innerError);
      if (innerError instanceof ApiError) {
        return next(innerError); // Pass along the custom error without rethrowing
      }
      return next(new ApiError(500, "An error occurred while creating the user"));
    }}
   catch (outerError) {
    console.error("Token validation or outer error:", outerError);
    if (outerError instanceof ApiError) {
      return next(outerError); // Pass along any custom error
    }
    return next(new ApiError(401, "Invalid access token"));
  }}
  else if (name && email && password) {
    try {
      const userExists = await amber.user.findUnique({ where: { email } });
      
      if (userExists) {
        return next(new ApiError(409, "User with this email already exists"));
      }

      const hashedPassword = await bcrypt.hash(password, 5);

      try { 
        const user = await amber.user.create({
          data: {
            username: name,
            email: email,
            password:hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          select:{
            id:true,
            name :true,       
            username  :true,     
            email : true,          
            profilepicture :true ,
            createdAt      :true,
            updatedAt      :true 
          }
        });

        const{accessToken,refreshToken}= await generateAccessAndRefereshTokens(user.id)

        req.user = user; // Attach user to request object
        req.accessToken=accessToken;
        req.refreshToken=refreshToken;
        next();
      } catch (innerError) {
        console.error("Database lookup error:", innerError);
        if (innerError instanceof ApiError) {
          return next(innerError); // Pass along the custom error without rethrowing
        }
        return next(new ApiError(500, "An error occurred while creating the user"));
      }}
     catch (outerError) {
      console.error("Token validation or outer error:", outerError);
      if (outerError instanceof ApiError) {
        return next(outerError); // Pass along any custom error
      }
      return next(new ApiError(401, "Invalid Credentials"));
    }}
    else {
      return next(new ApiError(400, "Missing required fields or token"));
    }  
})



export const verifyJWTa = asyncHandler(async (req, res, next) => {
  const auth_token =  req.header("Authorization")?.split(' ')[1];
  const cookie_token=req.cookies?.accessToken;

  if (!token) {
    return next(new ApiError(401, "Unauthorized request: Token not provided"));
  }
  if(auth_token){
  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH_APP, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      const user = await amber.user.findUnique({
        where: { username: "param" },
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
  }}
  else if(cookie_token){
    try {
      // Attempt to fetch user info based on the token
      const response = await axios.get(process.env.AUTH_FETCH_APP, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const userinfo = response.data;
      console.log("User info from auth service:", userinfo);
  
      // Check if user exists in the database
      try {
        const user = await amber.user.findUnique({
          where: { username: "param" },
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
  }

});

export const verifyJWTw = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized request: Token not provided"));
  }

  try {
    // Attempt to fetch user info based on the token
    const response = await axios.get(process.env.AUTH_FETCH_WEB, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userinfo = response.data;
    console.log("User info from auth service:", userinfo);

    // Check if user exists in the database
    try {
      const user = await amber.user.findUnique({
        where: { username: "param" },
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
