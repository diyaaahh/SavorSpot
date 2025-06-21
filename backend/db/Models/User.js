import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  location: {
    type: [Number], // [lng, lat]
    default: [85.3250, 27.7172]
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('User', userSchema);
