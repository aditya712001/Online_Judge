const mongoose = require('mongoose')

const Schema = mongoose.Schema

const submissionsSchema = new Schema({
  verdict: {
    type: String,
    required: true
  },
  title: { 
    type: String, 
    required: true 
  },
  user: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('submissions', submissionsSchema)