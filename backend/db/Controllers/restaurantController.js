import User from '../Models/User.js';
import Restaurant from '../Models/Restaurant.js';
import cloudinary from '../../utils/cloudinary.js';

export const addRestaurant = async (req, res) => {
  try {
    const [lng, lat] = JSON.parse(req.body.location);

    const user = await User.findById(req.user.id);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Unauthorized. Admins only." });
    }

    const venueImage = req.files?.venue;
    const menuImage = req.files?.menu;

    if (!venueImage || !menuImage) {
      return res.status(400).json({ message: "Venue and Menu images are required." });
    }

    // Upload images to Cloudinary
    const venueUpload = await cloudinary.uploader.upload(venueImage.tempFilePath);
    const menuUpload = await cloudinary.uploader.upload(menuImage.tempFilePath);

    const restaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      venue: venueUpload.secure_url,
      menu: menuUpload.secure_url,
      location: [lng, lat]
    });

    await restaurant.save();
    res.status(201).json({ message: "Restaurant added", restaurant });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add restaurant" });
  }
};


export const getNearbyRestaurants = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.location || user.location.length !== 2) {
      return res.status(400).json({ message: "User location is missing or invalid." });
    }

    const [lng, lat] = user.location;

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 5000
        }
      }
    });

    res.status(200).json({ restaurants });
  } catch (err) {
    console.error("Error fetching nearby restaurants:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving restaurant" });
  }
};


// export const getNearbyRestaurants = async (req, res) => {
//   const userId = req.user?.id;

//   const user = await User.findById(userId);

//   if (!user?.location) {
//     return res.status(400).json({ message: 'User location not found' });
//   }

//   const restaurants = [
//     {
//       name: "Thakali Delights",
//       address: "Lubhu Road, Mahalaxmi",
//       location: [85.532, 27.629],
//     },
//     {
//       name: "Everest Momos",
//       address: "Tikathali, Lalitpur",
//       location: [85.527, 27.622],
//     },
//     {
//       name: "Sajilo Biryani",
//       address: "Imadol, Lalitpur",
//       location: [85.535, 27.626],
//     },
//     {
//       name: "Chulo Restaurant & Bar",
//       address: "Lubhu, Lalitpur",
//       location: [85.521, 27.625],
//     },
//     {
//       name: "Ghar-e-Kabab",
//       address: "Sanagaun, Mahalaxmi",
//       location: [85.531, 27.619],
//     },
//   ];

//   res.status(200).json({ restaurants });
// };
