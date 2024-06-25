const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    deletedObjectId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        enum: ['add', 'edit', 'delete'],
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
});

module.exports = mongoose.model('Log', logSchema);
