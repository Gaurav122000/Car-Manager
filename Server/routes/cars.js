const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

//Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Ensure unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!'); // Reject non-image files
    }
  },
});

// Create a new car
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const { title, description, tags } = req.body;

    // Map file paths for each uploaded image
    const imagePaths = req.files.map((file) => 
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );

    const car = new Car({
      userId: req.user.id,
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images: imagePaths,
    });

    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload images', details: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  const { title, description, tags, images } = req.body;
  const car = new Car({ userId: req.user.id, title, description, tags, images });
  await car.save();
  res.json(car);
});

router.get('/', auth, async (req, res) => {
  const cars = await Car.find({ userId: req.user.id });
  res.json(cars);
});

router.get('/:id', auth, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).send('Car not found');
  res.json(car);
});

//Update a car
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    } else {
      const existingCar = await Car.findById(req.params.id);
      images = existingCar.images;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { title, description, tags: tags ? tags.split(',').map(tag => tag.trim()) : [], images },
      { new: true, runValidators: true }
    );

    if (!updatedCar) return res.status(404).send({ error: 'Car not found' });

    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update car', details: err.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.send({ message: 'Car deleted' });
});

router.get('/search', auth, async (req, res) => {
  const { q } = req.query;
  const cars = await Car.find({
    userId: req.user.id,
    $or: [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { tags: new RegExp(q, 'i') },
    ]
  });
  res.json(cars);
});

module.exports = router;
