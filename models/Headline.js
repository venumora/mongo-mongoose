const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HeadlineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Headline = mongoose.model("Headline", HeadlineSchema);
module.exports = Headline;
