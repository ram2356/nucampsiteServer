const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Replace 'User' with the corresponding model name for users
  },
  campsites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campsite", // Replace 'Campsite' with the corresponding model name for campsites
    },
  ],
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
