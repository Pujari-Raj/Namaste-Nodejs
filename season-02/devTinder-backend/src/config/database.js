const mongoose = require("mongoose");

const connectToDB = async () => {
    await mongoose.connect("mongodb+srv://basvarajpujari607:mggIsHwhae2SY9gn@pujari-basvaraj.kswbskn.mongodb.net/test-dev-tinder")
}

module.exports = connectToDB