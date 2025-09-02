const mongoose = require("mongoose")

const noteModel = mongoose.Schema({
    note_privacy:{
        type: String,
        enum: ["public", "private"],
        default: "private"
        //type: Boolean // true for private, false for public
    },
    note_title:{ //not required
        type: String,
        maxLength: 100 //100 character limit
    },
    note_text:{
        type: String,
        required: true,
        maxLength: 500 //500 char limit
    },
    tags:{
        type: [String], //array of strings
        default: [] //default empty (no tags)
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", //must match user schema name
        required: true
    },
    //sharing the note
    shareToken:{
        type: String,
        unique: true,
        sparse: true //makes sure no note has the same share link
    },
    expiresAt:{
        type: Date
    }
},{
    timestamps: true
}
)

module.exports = mongoose.model("note", noteModel)