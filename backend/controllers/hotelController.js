const Hotel = require("../models/Hotel");
const editableFields = ["name", "description", "destination", "state", "address", "pricePerNight", "images", "amenities", "roomsAvailable", "tags"];
const pickEditable = (body) => Object.fromEntries(editableFields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));

// GET /api/hotels?destination=Goa&minPrice=&maxPrice=&sort=rating
exports.listHotels = async (req, res) => {
  try {
    const { destination, minPrice, maxPrice, search, sort } = req.query;
    const filter = {};
    if (destination) filter.destination = new RegExp(destination, "i");
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    let query = Hotel.find(filter);
    if (sort === "price_asc") query = query.sort({ pricePerNight: 1 });
    else if (sort === "price_desc") query = query.sort({ pricePerNight: -1 });
    else query = query.sort({ rating: -1 });

    const hotels = await query.limit(100);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hotels", error: err.message });
  }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hotel", error: err.message });
  }
};

exports.myHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your hotels", error: err.message });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create({ ...pickEditable(req.body), vendor: req.user.id });
    res.status(201).json(hotel);
  } catch (err) {
    res.status(400).json({ message: "Failed to create hotel", error: err.message });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      pickEditable(req.body),
      { new: true, runValidators: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found or not owned by you" });
    res.json(hotel);
  } catch (err) {
    res.status(400).json({ message: "Failed to update hotel", error: err.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!hotel) return res.status(404).json({ message: "Hotel not found or not owned by you" });
    res.json({ message: "Hotel removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete hotel", error: err.message });
  }
};
