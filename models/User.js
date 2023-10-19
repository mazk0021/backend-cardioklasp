const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['ADMIN', 'PATIENT', 'DOCTOR'],
        default: 'PATIENT',
        uppercase: true
    },
    picture: { type: String, required: true, default: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png" },
    isDoctorAccepted: { type: Boolean, default: false },
    doctorTimeSlots: [{ start: String, end: String, price: Number }],
    designation: { type: String},
    about: {type: String},
    price: {type: String}

});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    const user = this;
    console.log("user in smodel USER", user)
    if (!this.isModified) {
        next();
    }
    else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        console.log("hashed password before save is", hash)
        user.password = hash
        console.log("user in model USER after hash", user)
    }
});

module.exports = mongoose.model("User", userSchema, "Users");