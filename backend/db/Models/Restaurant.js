import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    venue:{
        type:String,
        required: true
    },
    menu:{
        type: String,
        required: true
    },
    location:{
        type: [Number], // [lng, lat]
        required: true,
         default: [85.3250, 27.7172] // Default to Kathmandu coordinates
    },
    phone :{
        type: String,
        required: true
    }
})
restaurantSchema.index({ location: '2dsphere' });
export default mongoose.model("Restaurant", restaurantSchema);