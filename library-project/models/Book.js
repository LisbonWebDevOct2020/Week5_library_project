const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    //author: String,
    author: {
      type: Schema.Types.ObjectId, //Foreign key
      ref: 'Author' //Relates to Author model
    },
    reviews: [
      {
        user: String,
        comment: String
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = model('Book', bookSchema);