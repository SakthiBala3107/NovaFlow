import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    businessName: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

// password hashing middleware
userSchema.pre("save", async function (next) {
  //   if the pass word is not chnaged then we have to move one
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// METHDS TO COMPARE PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword) return;
  return await bcrypt.compare(enteredPassword, this.password);
};

//
const User = mongoose.model("User", userSchema);
export default User;
