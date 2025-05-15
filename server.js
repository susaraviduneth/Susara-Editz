const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/susara_editz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Feedback schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve your static frontend

// API endpoint to get feedback
app.get('/api/feedback', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ date: -1 });
  res.json(feedbacks);
});

// API endpoint to post feedback
app.post('/api/feedback', async (req, res) => {
  const { name, message } = req.body;
  if (name && message) {
    const feedback = new Feedback({ name, message });
    await feedback.save();
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Missing fields' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});