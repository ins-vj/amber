import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadProfile = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        console.log("reached cloudinary")

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            folder: "profilePictures", // This will create a folder in cloudinary
            transformation: [
                { width: 1920, height: 1080, crop: "fill" },
                { quality: "auto" }
            ]
        });

        // File has been uploaded successfully
        // console.log("File uploaded successfully on cloudinary", response.url);

        // Remove file from local storage
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const uploadContentVideo = async (localFilePath,folderPath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response =  await cloudinary.uploader.upload(filePath, {
            folder: folderPath,
            resource_type: "video",
            eager: [
                { streaming_profile: "full_hd", format: "m3u8" },
                { format: "mp4", transformation: [{ quality: "auto" }] }
            ],
            eager_async: true,
        });

        console.log(response)

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        await fs.unlink(localFilePath)
        return response;

    } catch (error) {
        await fs.unlink(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const uploadPromoVideo = async (localFilePath,folderPath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response =  await cloudinary.uploader.upload(filePath, {
            folder: folderPath,
            resource_type: "video",
            eager: [
                { streaming_profile: "full_hd", format: "m3u8" },
                { format: "mp4", transformation: [{ quality: "auto" }] }
            ],
            eager_async: true,
        });

        console.log(response)

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const uploadThumbnail = async (localFilePath,folderPath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response =  await cloudinary.uploader.upload(filePath, {
            folder: folderPath,
            resource_type: "image",
            transformation: [
                { width: 1280, height: 720, crop: "fill" },
                { quality: "auto" }
            ]
        });

        console.log(response)

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const uploadBanner = async (localFilePath,folderPath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response =  await cloudinary.uploader.upload(filePath, {
            folder: folderPath,
            resource_type: "image",
            transformation: [
                { width: 1920, height: 1080, crop: "fill" },
                { quality: "auto" }
            ]
        });

        console.log(response)

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deletePromo = async (publicId) => {
    try {
        if (!publicId) return null;

        // Delete the main video asset
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
            invalidate: true  // Invalidate CDN cache
        });

        // Delete the derived videos (streaming versions)
        await cloudinary.api.delete_derived_resources([publicId], {
            resource_type: "video",
            type: "upload",
            invalidate: true
        });

        console.log("Video and its derivatives deleted from cloudinary:", response);
        return response;

    } catch (error) {
        console.error("Error deleting video from cloudinary:", error);
        return null;
    }
}

const deleteBanner= async (publicId) => {
    try {
        if (!publicId) return null;

        // Delete the image and its transformations
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
            invalidate: true  // Invalidate CDN cache
        });

        // Delete all transformed versions of the image
        await cloudinary.api.delete_derived_resources([publicId], {
            resource_type: "image",
            type: "upload",
            invalidate: true
        });

        console.log("Image and its transformations deleted from cloudinary:", response);
        return response;

    } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
        return null;
    }
}

const deleteProfile = async (publicId) => {
    try {
        if (!publicId) return null;

        // Delete the file from cloudinary
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });

        return response;

    } catch (error) {
        console.error("Error while deleting file from cloudinary:", error);
        return null;
    }
};


export { 
    uploadProfile,
    uploadContentVideo,
    uploadPromoVideo,
    uploadThumbnail,
    uploadBanner,
   deletePromo,
   deleteBanner,
   deleteProfile
};