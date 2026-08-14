-- CreateIndex
CREATE INDEX "Booking_roomId_status_checkIn_checkOut_idx" ON "Booking"("roomId", "status", "checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "Hotel_cityId_idx" ON "Hotel"("cityId");

-- CreateIndex
CREATE INDEX "Hotel_propertyTypeId_idx" ON "Hotel"("propertyTypeId");

-- CreateIndex
CREATE INDEX "Hotel_avgReview_idx" ON "Hotel"("avgReview");

-- CreateIndex
CREATE INDEX "Hotel_reviewCount_idx" ON "Hotel"("reviewCount");

-- CreateIndex
CREATE INDEX "Hotel_isFeatured_idx" ON "Hotel"("isFeatured");

-- CreateIndex
CREATE INDEX "Hotel_createdAt_idx" ON "Hotel"("createdAt");

-- CreateIndex
CREATE INDEX "HotelAmenities_amenitiesId_idx" ON "HotelAmenities"("amenitiesId");

-- CreateIndex
CREATE INDEX "Room_hotelId_idx" ON "Room"("hotelId");

-- CreateIndex
CREATE INDEX "Room_capacity_idx" ON "Room"("capacity");
