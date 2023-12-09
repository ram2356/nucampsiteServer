const mongoose = require("mongoose");
const Currency = require("mongoose-currency").loadType(mongoose);
const { Schema } = mongoose;

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    cost: {
      type: Currency,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
