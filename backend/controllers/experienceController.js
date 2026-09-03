const Experience = require("../models/Experience");
const editableFields = ["title", "category", "destination", "description", "price", "durationHours", "images"];
const pickEditable = (body) => Object.fromEntries(editableFields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));

exports.listExperiences = async (req, res) => {
  try {
    const { destination, category } = req.query;
    const filter = {};
    if (destination) filter.destination = new RegExp(destination, "i");
    if (category) filter.category = category;
    const experiences = await Experience.find(filter).sort({ rating: -1 }).limit(100);
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch experiences", error: err.message });
  }
};

exports.getExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch experience", error: err.message });
  }
};

exports.myExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your experiences", error: err.message });
  }
};

exports.createExperience = async (req, res) => {
  try {
    const exp = await Experience.create({ ...pickEditable(req.body), vendor: req.user.id });
    res.status(201).json(exp);
  } catch (err) {
    res.status(400).json({ message: "Failed to create experience", error: err.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      pickEditable(req.body),
      { new: true, runValidators: true }
    );
    if (!exp) return res.status(404).json({ message: "Experience not found or not owned by you" });
    res.json(exp);
  } catch (err) {
    res.status(400).json({ message: "Failed to update experience", error: err.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!exp) return res.status(404).json({ message: "Experience not found or not owned by you" });
    res.json({ message: "Experience removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete experience", error: err.message });
  }
};
