const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });

        // Changes will not be persisted to MongoDB when a pre hook errored out
        await user.save(); // save to MongoDB (asynchronous request)
        const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");

        res.status(201).send({ token: token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(422)
            .send({ error: "Must provide email and password!" });
    }

    // check if email/user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ error: "Invalid Password or Email!" });
    }
    // after user is found, check if the password is correct
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
        res.status(200).send({ token: token });
    } catch (err) {
        // err from user.comparePassword(password);
        return res.status(401).send({ error: "Invalid Password or Email!" });
    }
});

module.exports = router;
