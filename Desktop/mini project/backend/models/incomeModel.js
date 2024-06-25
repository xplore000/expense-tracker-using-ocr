const mongoose = require('mongoose')

const incomeSchema=new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },

},{timestamps:true})

module.exports = mongoose.model('income',incomeSchema)