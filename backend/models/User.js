const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: email => User.doesNotExist({ email }),
      message: "Email already exists"
    }
  },
  name: {
    type: String,
    validate: {
      validator: name => User.doesNotExist({ name }),
      message: "Username already exists"
    }
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.statics.doesNotExist = async function (field) {
  return await this.where(field).countDocuments() === 0;
};

module.exports = User = mongoose.model("User", UserSchema, "User");
