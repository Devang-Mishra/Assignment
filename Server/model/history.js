import mongoose from "mongoose";

const historySchema=mongoose.Schema({
    result: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    } ,
    id: {type:String}
})

export default mongoose.model("user",historySchema) 