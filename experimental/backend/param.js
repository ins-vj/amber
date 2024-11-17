import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
cloudinary.config({
    cloud_name: 'dcdlxeu52', 
    api_key: '943815187825651', 
    api_secret: 'eCqi2yWfFG_0Iu-zRT6_X40sZV4' 
})
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
deleteBanner("courses/course_1731860592247/promo/pdaghb8har5govvqpxpa");