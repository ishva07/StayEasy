import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "stayeasy",
    allowed_formats: ["jpeg", "png", "jpg"],
  }),
});

const fileFilter = (req:any,file:Express.Multer.File,cb:any)=>{
    const allowedTypes = ["image/jpeg","image/png","image/jpg"];
    if(allowedTypes.includes(file.mimetype))
        cb(null,true)
    else
        cb(new Error("file Type not allowed .. add valid files"))
}

export const uploads = multer({
    storage,
    fileFilter,
    limits:{fileSize: 5 * 1024 * 1024}
})