const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

// create router object
const router = express.Router();

router.use(requireAuth); // all the request handlers will use requireAuth to auth user

// fetch all the tracks the user has created
router.get("/tracks", async (req, res) => {
    // get the current user - user object has attached to req by requireAuth
    // find all tracks by the userId
    const tracks = await Track.find({ userId: req.user._id });

    // send back to user
    res.send(tracks);
});

// create a track
router.post("/tracks", async (req, res) => {
    // get track name and list of location points from request body
    const { name, locations } = req.body;

    if (!name || !locations) {
        return res
            .status(422)
            .send({ error: "You must provide a name and locations!" });
    }

    try {
        // create the new track, and add the current user's user id to it.
        const track = new Track({
            userId: req.user._id,
            name: name,
            locations: locations,
        });
        await track.save(); // mongo will handle the validation of the track object

        // if success, send back the track to user - for now
        res.status(201).send(track);
    } catch (err) {
        res.status(422).send({ error: "Error saving track" });
    }
});

module.exports = router;
