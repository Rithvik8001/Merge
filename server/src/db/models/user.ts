import { Schema, Model } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    trim: true,
    minLength: 6,
    maxLength: 15,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female"],
    },
  },
  about: {
    type: String,
    default: "Express about yourself here..",
  },
});

const User = new Model("User", userSchema);

export default User;
