import mongoose from "mongoose";
import argon2 from "argon2";
import crypto from "crypto";
import { RESET_PASSWORD_EXPIRY } from "../constants/constant.js";
import Organization from "./Organization.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    loginMethod: {
      type: String,
      enum: ["manual", "google", "github"],
      default: "manual",
    },
    avatar: {
      url: String,
      public_id: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
      default: "Hey, I'm using Neptask",
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Otp",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: { type: String },
    role: {
      type: String,
      enum: ["super-admin", "owner", "admin", "member", "viewer", "manager"],
      default: "member",
    },

    organizations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      language: {
        type: String,
        default: "en",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    lastLogin: Date,
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(28).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = new Date() + RESET_PASSWORD_EXPIRY;
  return resetToken;
};

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;
  if (!userId) return next();

  await Organization.updateMany(
    { members: userId },
    { $pull: { members: { user: userId } } }
  );
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
