const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TweetModel = mongoose.model("TweetModel")
const ProtectedRoute = require("../middleware/protectedResource")

router.post('/tweet', ProtectedRoute, async (req, res) => {
    try {
        const { content, image } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Write some content to post a tweet' })
        }
        const tweetObj = await new TweetModel({ content, image, tweetedBy: req.user })
        tweetObj.save()
        return res.status(200).json({ tweet: tweetObj })
    } catch (error) {
        console.log(error)
    }
});

//getting my all tweets.
router.get('/profile/:id', ProtectedRoute, async (req, res) => {
    try {
        const userId = req.params.id;
        const myTweets = await TweetModel.find({ tweetedBy: userId })
            .populate("tweetedBy", "_id Name Username email profilePicture")
            .populate("likes", "_id Name Username")
            // .populate("replies.repliedBy", "_id Name Username")
            .exec()
        if (myTweets.length === 0) {
            return res.status(400).json({ error: 'You dont have any tweets' })
        }

        return res.status(200).json({ tweets: myTweets })
    } catch (error) {
        console.log(error)
    }
});

//like tweet route
router.put('/tweet/:id/like', ProtectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id
        const tweetDetails = await TweetModel.findByIdAndUpdate(tweetId, { $addToSet: { likes: req.user._id } }, {
            new: true
        })
        if (!tweetDetails) {
            return res.status(400).json({ error: 'Can not find Tweet' })
        }
        return res.status(200).json({ tweet: tweetDetails })
    } catch (error) {
        console.log(error)
    }
});

//dislike tweet route
router.put('/tweet/:id/dislike', ProtectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id
        const tweetDetails = await TweetModel.findByIdAndUpdate(tweetId, { $pull: { likes: req.user._id } }, {
            new: true
        })
        return res.status(200).json({ tweet: tweetDetails })
    } catch (error) {
        console.log(error)
    }
});

//reply on tweet i am using post endpoint as it was mentioned
router.post('/tweet/:id/reply', ProtectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id
        // const comment = { commentText: req.body.commentText, commentedBy: req.user._id }
        const { content } = req.body
        const parentTweet = await TweetModel.findById(tweetId)
        if (!parentTweet) {
            return res.status(400).json({ error: 'Some error' })
        }
        const replyObj = new TweetModel({
            content,
            tweetedBy: req.user
        })
        await replyObj.save()

        parentTweet.replies.push(replyObj._id)
        await parentTweet.save()

        return res.status(200).json({ result: replyObj })
    } catch (error) {
        console.log(error)
    }
});


//get single tweet detail
router.get('/gettweet/:id', ProtectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const tweetDetails = await TweetModel.findById(tweetId).populate('replies')
            .populate("tweetedBy", "_id Name Username email profilePicture")
            .populate("likes", "_id Name Username")
            // .populate("replies.repliedBy", "_id Name Username")
            .exec()
        const replyDetails = await Promise.all(tweetDetails.replies.map(async (replyId) => {
            const replytweet = await TweetModel.findById(replyId)
                .populate("tweetedBy", "_id Name Username email profilePicture")
            return replytweet
        }))
        return res.status(200).json({ tweetDetails, replyDetails })
    } catch (error) {
        console.log(error)
    }
});

//get all tweet details
router.get('/getalltweets', ProtectedRoute, async (req, res) => {
    try {
        const tweetDetails = await TweetModel.find()
            .populate("tweetedBy", "_id Name Username email profilePicture")
            .populate("likes", "_id Name Username")
            .populate("retweetBy", 'Username Name')
            // .populate("replies.repliedBy", "_id Name Username")
            .exec()
        return res.status(200).json({ tweets: tweetDetails })
    } catch (error) {
        console.log(error)
    }
});

//delete a tweet
router.delete('/deletetweet/:id', ProtectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id
        const tweet = await TweetModel.findOne({ _id: tweetId })
            .populate("tweetedBy", "_id")
            .exec()
        if (req.user._id.toString() === tweet.tweetedBy._id.toString()) {
            const deleteTweet = await TweetModel.findByIdAndDelete(tweetId)
            return res.status(200).json({ result: "Tweet deleted succesfully", deleteTweet })
        } else {
            return res.status(400).json({ result: "You are not authorised to delete this tweet" })
        }
    } catch (error) {
        console.log(error)
    }
});

//retweet 
router.post('/tweet/:id/retweet', ProtectedRoute, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const tweetDetails = await TweetModel.findById(tweetId)
        if (tweetDetails) {
            const retweet = new TweetModel({
                retweet: tweetId,
                tweetedBy: req.user,
                image: tweetDetails.image,
            })

            const saveRetweet = await retweet.save()
            const tweet = await TweetModel.findByIdAndUpdate(tweetId, { $addToSet: { retweetBy: req.user._id } }, {
                new: true
            })
                .populate("retweetBy", "_id Name Username")

            res.status(200).json({ retweet: saveRetweet, tweet: tweet })
        }
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;