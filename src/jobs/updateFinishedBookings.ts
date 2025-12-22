import { Booking } from "../model/booking.js";
import { BookingAbs } from "../interface/booking_abs.js";

/**
 * Background job: Update all past bookings to "completed".
 * Uses native Date object instead of dayjs.
 */
export const updateFinishedBookings = async (): Promise<void> => {
    try {
        const now = new Date(); // current date and time

        // Update all bookings in the past where status is not yet "completed"
        const result = await Booking.updateMany(
            { startTime: { $lt: now }, status: { $ne: "completed" } },
            { $set: { status: "completed" } }
        );

        if (result.modifiedCount && result.modifiedCount > 0) {
            console.log(`[Booking Job] Updated ${result.modifiedCount} bookings to completed at ${now.toISOString()}`);
        } else {
            console.log(`[Booking Job] No bookings to update at ${now.toISOString()}`);
        }
    } catch (error) {
        console.error("[Booking Job] Error updating finished bookings:", error);
    }
};
