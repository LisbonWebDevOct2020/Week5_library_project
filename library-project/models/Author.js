const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema({
  name: String
});

const Author = model('Author', authorSchema);

module.exports = Author;