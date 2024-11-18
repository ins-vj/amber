import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Reached here")
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
      console.log("Reached there")
    }
  })
  
export const upload = multer({ 
    storage, 
})