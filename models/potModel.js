const mongoose = require('mongoose');

const potSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'A pot must have an name'],
  },
  target: {
    type: Number,
    required: [true, 'A pot must have a target'],
  },
  total: {
    type: Number,
    required: [true, 'A pot must have a total'],
  },
  theme: {
    type: String,
    required: [true, 'A pot must have a theme'],
  },
});

const Pot = mongoose.model('Pot', potSchema);

module.exports = Pot;
