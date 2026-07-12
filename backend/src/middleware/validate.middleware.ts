import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"

const validate = (schema:ZodSchema) => async(req:Request,res:Response,next:NextFunction) =>{
    try {
       const parsed:any = await schema.parseAsync({
        body : req.body,
        params : req.params,
        query : req.query,
       })

       req.body = parsed.body;
       
       next()
    } catch (error) {
        next(error)
    }
}

export default validate