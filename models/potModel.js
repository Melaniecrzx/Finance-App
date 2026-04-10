const mongoose = require('mongoose');

const potSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'A pot must have an name'],
  },
  target: {
    type: Number,
  },
  total: {
    type: Number,
  },
  theme: {
    type: String,
  },
});

const Pot = mongoose.model('Pot', potSchema);

module.exports = Pot;
