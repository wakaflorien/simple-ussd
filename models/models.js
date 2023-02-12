import mongoose, {model} from "mongoose";

export const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  tickets: {
    required: true,
    type: Number
  }
})
export default mongoose.model("Data", dataSchema)
