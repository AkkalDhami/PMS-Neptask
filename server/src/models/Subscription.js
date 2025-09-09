import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        default: "monthly"
    },
    nextBillingDate: Date,
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
