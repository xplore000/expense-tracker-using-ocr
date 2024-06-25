// 1. Import necessary modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 2. Define a schema for the ticket
const ticketSchema = new Schema({
  userMessage: {
    type: String,
    required: true
  },
  ticketNumber: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 3. Create a model based on the schema
const Ticket = mongoose.model('Ticket', ticketSchema);

// 4. Export the model to be used in other parts of the application
module.exports = Ticket;
