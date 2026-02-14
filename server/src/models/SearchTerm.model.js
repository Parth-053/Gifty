import mongoose from "mongoose";

const searchTermSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Prevent duplicate entries
    },
    count: {
      type: Number,
      default: 1, // Start count at 1
    },
    lastSearchedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export const SearchTerm = mongoose.model("SearchTerm", searchTermSchema);