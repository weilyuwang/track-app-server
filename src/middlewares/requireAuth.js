const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

/* 
 middleware function to process jwt in the request header sent by user
 */

module.exports = (req, res, next) => {
    // extract the `Authorization` header val from user request headers
    const { authorization } = req.headers; // lower case will do
    if (!authorization) {
        return res.status(401).send({ error: "You need to log in first!" });
    }

    // authorization === Bearer #$@#$@$#@$#@
    // extract the JWT value from the authorization header
    const token = authorization.replace("Bearer ", ""); // get rid of Bearer prefix

    jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "You need to log in first!" });
        }
        // payload === {userId: user_id}
        const { userId } = payload;
        const user = await User.findById(userId); // find User from MongoDB by the given user id

        req.user = user; // attach the user model to the req object

        next(); // indicates that this middleware is finished, hand over to the next middleware if exists
    });
};
