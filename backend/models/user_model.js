const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://images.unsplash.com/photo-1504238624541-bca0f332da07?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    location: {
        type: String
    },
    DOB: {
        type: Date
    },

    followers: [
        {
            type: ObjectId,
            ref: 'UserModel'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'UserModel'
        }
    ]
}, { timestamps: true })

mongoose.model("UserModel", userSchema)