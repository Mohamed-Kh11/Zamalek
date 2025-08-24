import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("pass")) return next();
  this.pass = await bcrypt.hash(this.pass, 10);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
