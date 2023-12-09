const mongoose = require("mongoose");
const Campsite = require("../model/campsite");

const url = "mongodb://localhost:27017/nucampsite";
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(() => {
  console.log("Connected correctly to server");

  const newCampsite = new Campsite({
    name: "React Lake Campground",
    description: "test",
  });

  newCampsite
    .save()
    .then((campsite) => {
      console.log(campsite);
      return Campsite.findByIdAndUpdate(
        campsite_id,
        {
          $set: { description: "Updated Test Document" },
        },
        {
          new: true,
        }
      );
    })
    .then((campsite) => {
      console.log(campsite);

      campsite.comments.push({
        rating: 5,
        text: "What a magnificent view!",
        author: "Tinus Lorvaldes",
      });

      return campsite.save();
    })
    .then((campsite) => {
      console.log(campsite);
      return Campsite.deleteMany();
    })
    .then(() => {
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
    });
});
