import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { hasPermission } from "../../middleware/permission.middleware";
import validate from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../constant/permissions";
import { uploads } from "../../middleware/uploads.middleware";
import {
    createPropertyTypeController,
    deletePropertyTypeController,
    editPropertyTypeController,
    getAllPropertyTypeController,
    getPropertyTypeController,
} from "./propertyType.controller";
import { createPropertyTypeSchema, editPropertyTypeSchema } from "./propertyType.validation";

const propertyTypeRoute = Router();

propertyTypeRoute.post("/", authenticate(), hasPermission(PERMISSIONS.ADD_PROPERTY_TYPE), uploads.single("propertyTypeImage"), validate(createPropertyTypeSchema), createPropertyTypeController);
propertyTypeRoute.put("/:propertyTypeId", authenticate(), hasPermission(PERMISSIONS.EDIT_PROPERTY_TYPE), uploads.single("propertyTypeImage"), validate(editPropertyTypeSchema), editPropertyTypeController);
propertyTypeRoute.delete("/:propertyTypeId", authenticate(), hasPermission(PERMISSIONS.DELETE_PROPERTY_TYPE), deletePropertyTypeController);
propertyTypeRoute.get("/all", getAllPropertyTypeController); 
propertyTypeRoute.get("/", getPropertyTypeController); 
export default propertyTypeRoute;
