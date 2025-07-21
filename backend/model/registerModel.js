import mongoose from "mongoose";

const registerSchema = new mongoose.Schema([
  {
    fullName: {
      type: String,
      required: true,
    },
    subjectNames: {
      type: [String],
      required: true,
    },
    daysAvailable: {
      type: [String],
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
]);
export const RegisterModel = mongoose.model(
  "registered tutors",
  registerSchema
);
