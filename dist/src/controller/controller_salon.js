import { SalonAbs } from "../interface/salon_abs.js";
import { Salon } from "../model/salon.js";
class SalonController extends SalonAbs {
    // always return the only salon
    async getSalon(req, res) {
        try {
            const salon = await Salon.findOne();
            res.status(200).json({ success: true, salon });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    // update the only salon
    async updateSalon(req, res) {
        try {
            const updateData = req.body;
            const salon = await Salon.findOneAndUpdate({}, updateData, { new: true });
            res.status(200).json({ success: true, salon });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
export default new SalonController();
