const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        // required: true
    },
    tweetedBy: {
        type: ObjectId,
        ref: 'UserModel'
    },
    likes: [
        {
            type: ObjectId,
            ref: 'UserModel'
        }
    ],
    retweetBy: [
        {
            type: ObjectId,
            ref: 'UserModel'
        }
    ],
    retweet: {
        type: ObjectId,
        ref: 'TweetModel'
    },
    image: {
        type: String,
        default: ''

    },
    replies: [
        {
            type: ObjectId,
            ref: 'TweetModel'
        }
    ]
}, { timestamps: true })

mongoose.model("TweetModel", tweetSchema);