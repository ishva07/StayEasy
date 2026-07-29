-- DropForeignKey
ALTER TABLE "HotelAmenities" DROP CONSTRAINT "HotelAmenities_amenitiesId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_hotelId_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelAmenities" ADD CONSTRAINT "HotelAmenities_amenitiesId_fkey" FOREIGN KEY ("amenitiesId") REFERENCES "Amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
