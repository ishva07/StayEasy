import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null,"/uploads")
    },
    filename(req, file, callback) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random()*1E9)
        callback(null,uniqueName+path.extname(file.originalname));
    },
})

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