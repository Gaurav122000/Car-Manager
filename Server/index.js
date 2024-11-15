const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected :-)'))
  .catch(err => console.log(err, ":-("));
  
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
