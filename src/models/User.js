const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// define MongoDB User model schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// to get the user reference from `this` keyword, we need to use function() {}
// instead of arrow function: () => {}
// Pre middleware functions are executed one after another, when each middleware calls next().
userSchema.pre("save", function (next) {
    const user = this;

    // if user has not modified the password, call next() to pass on to the next func
    if (!user.isModified("password")) {
        return next(); // `return next();` will make sure the rest of this function doesn't run
    }

    // 10 is a number to represent the degree of complexity of the salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            // If you call `next()` with an argument, that argument is assumed to be an error.
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            // update the user's password to the generated hash value
            user.password = hash;

            // continue on to user.save() process to persist user into MongoDB
            next();
        });
    });
});

// attach comparePassword to userSchema
userSchema.methods.comparePassword = function (candidatePassword) {
    // this === user
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    });
};

mongoose.model("User", userSchema);
