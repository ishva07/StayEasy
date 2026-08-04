import z from "zod";

export const createCitySchema = z.object({
    body : z.object({
        name:z.string().min(2,"City name should be of alteast 2 character."),
    })
})

export const editCitySchema = z.object({
    body : z.object({
        name:z.string().min(2,"City name should be of alteast 2 character.").optional(),
    })
})