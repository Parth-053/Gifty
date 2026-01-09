import mongoose from "mongoose";

const aiConfigSchema = new mongoose.Schema(
  {
    //  Flexible trigger (NOT enum)
    trigger: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
      /*
        examples:
        "birthday"
        "anniversary"
        "mood"
        "festival"
        "budget"
        "relationship"
      */
    },

    // Admin-defined AI / rule logic
    rules: {
      type: Object,
      required: true,
      default: {}
      /*
        example:
        {
          categories: ["birthday", "for-her"],
          maxPrice: 2000,
          tags: ["romantic", "personalized"],
          priority: "rating"
        }
      */
    },

    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

//  Ensure one active config per trigger
aiConfigSchema.index(
  { trigger: 1, active: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const AIConfig = mongoose.model("AIConfig", aiConfigSchema);

export default AIConfig;
