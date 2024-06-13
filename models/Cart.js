const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  items: [
    {
      book: {
        type: Schema.Types.ObjectId,
        ref: 'books'
      },
      quantity: {
        type: Number,
        default: 1
      },
      status:{
        type:Boolean,
        default:false
      }
    }
  ]
});

module.exports = mongoose.model('cart', CartSchema);