import { Booking } from "../model/booking.js";

export const updateFinishedBookings = async (): Promise<void> => {
    try {
        const now = new Date();

        const bookings = await Booking.find({
            status: { $in: ["pending", "confirmed"] }
        });

        let updatedCount = 0;

        for (const booking of bookings) {

            const bookingEnd = new Date(
                `${booking.date.toISOString().split("T")[0]}T${booking.endTime}`
            );

            if (bookingEnd < now) {
                booking.status = "completed";
                await booking.save();
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`[Booking Job] ✅ ${updatedCount} bookings marked as completed.`);
        }
    } catch (error) {
        console.error("[Booking Job] ❌ Error updating bookings:", error);
    }
};
