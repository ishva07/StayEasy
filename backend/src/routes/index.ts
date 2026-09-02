import {Router} from "express"
import hotelRoute from "../modules/hotels/hotel.route";
import roomRoute from "../modules/rooms/room.route";
import authRoute from "../modules/auth/auth.route";
import bookingRoute from "../modules/booking/booking.routes";
import hotelAmenities from "../modules/hotelAmenities/hotelAmenities.route";
import amenities from "../modules/amenities/amenities.route";
import hotelImages from "../modules/hotelImageGallery/imagesGalleryRoutes";
import dashboardRoute from "../modules/dashboard/dashboard.route";
import cityRoute from "../modules/city/city.route";
import propertyTypeRoute from "../modules/propertyType/propertyType.route";
import reviewRoute from "../modules/reviews/reviews.route";
import aiSearchRoute from "../modules/aiSearchLog/aiSearchLog.route";
import aiSearchLogAdminRoute from "../modules/aiSearchLogAdmin/aiSearchLogAdmin.route";
import roleRoute from "../modules/roles/role.route";
import userRoute from "../modules/user/user.route";
import permissionRoute from "../modules/permission/permission.route";
import rolePermissionRoute from "../modules/role-permission/role-permission.route";

const route = Router();

route.use("/auth",authRoute);
route.use("/hotels",hotelRoute);
route.use("/hotels",roomRoute);
route.use("/bookings",bookingRoute);
route.use("/hotels",hotelAmenities);
route.use("/amenities",amenities);
route.use("/hotels",hotelImages);
route.use("/dashboard",dashboardRoute);
route.use("/city",cityRoute);
route.use("/property-type",propertyTypeRoute);
route.use("/reviews",reviewRoute);
route.use("/search/ai", aiSearchRoute);
route.use("/ai-search-logs",aiSearchLogAdminRoute);
route.use("/role", roleRoute);
route.use("/role-permission", rolePermissionRoute);
route.use("/permission", permissionRoute);
route.use("/user", userRoute);

export default route;