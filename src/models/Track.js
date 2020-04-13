const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
    timestamp: Number, // a number that represents milliseconds since 1970
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number,
    },
});

const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // pointing to User model
    },
    name: {
        type: String,
        default: "",
    },
    locations: [pointSchema],
});

mongoose.model("Track", trackSchema);
