const mongoose = require('mongoose')

const Schema = mongoose.Schema

const problemsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  statement: { 
    type: String, 
    required: true 
  },
  ip:{
    type: String
  },
  op:{
    type: String
  }
// ,
//   user_id: {
//     type: String,
//     required: true
//   }
}, { timestamps: true })

module.exports = mongoose.model('problems', problemsSchema)