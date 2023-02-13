import { Schema, model, Types } from 'mongoose'

const noteSchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        min: [2, "Length of title must be more than 2 "],
        max: [20, "Length of title must not be more than 20 "],
    },
    desc: {
        type: String,
        required: [true, "desc is required"],
        min: [2, "Length of desc must be more than 2 "],
        max: [20, "Length of desc must not be more than 20 "],
    },
    userID:{
        type: Types.ObjectId,
        required: [true, "note title is required"],
        ref: 'User'
    }
}, {
    timestamps: true
})


export const noteModel = model('Note', noteSchema)


