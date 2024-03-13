const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const bcryptjs = require('bcryptjs')
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const ProtectedRoute = require('../middleware/protectedResource')

//signup with unique email and username
router.post('/signup', (req, res) => {
    const { Name, Username, email, password } = req.body;
    if (!Name || !Username || !email || !password) {
        return res.status(400).json({ error: 'One or more fields are empty' })
    }

    UserModel.findOne({ email: email, Username: Username })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(400).json({ error: 'User with this email already exist' })
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ Name, Username: '@' + Username, email, password: hashedPassword })
                    user.save()
                        .then((newUser) => {
                            res.status(200).json({ result: 'User signed up succesfully' })
                        }).catch((error) => {
                            console.log(error)
                        })
                }).catch((error) => {
                    console.log(error)
                })
        }).catch((error) => {
            console.log(error)
        })
});

router.post('/login', async (req, res) => {
    try {
        const { Username, password } = req.body;
        if (!Username || !password) {
            return res.status(400).json({ error: 'One or more fields are empty' })
        }
        const userInDB = await UserModel.findOne({ Username: Username })
        if (!userInDB) {
            return res.status(400).json({ error: 'Invalid User Name ' })
        }
        const didMatch = await bcryptjs.compare(password, userInDB.password)
        if (didMatch) {
            const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET)
            const userInfo = { "_id": userInDB._id, "Username": userInDB.Username, "email": userInDB.email, "Name": userInDB.Name }
            res.status(200).json({ result: { token: jwtToken, user: userInfo } })
        } else {
            return res.status(400).json({ error: 'Invalid Password' })
        }
    } catch (error) {
        console.log(error)
    }
})


//get single user detail
router.get('/user/:id', ProtectedRoute, async (req, res) => {
    try {
        const userId = req.params.id
        const userData = await UserModel.findById(userId)
        if (!userData) {
            return res.status(400).json({ error: 'User not found' })
        }
        return res.status(200).json({ result: userData })
    } catch (error) {
        console.log(error)
    }
})

//follow user
router.post('/user/:id/follow', ProtectedRoute, async (req, res) => {
    try {
        const othersUserId = req.params.id;
        const myUserId = req.user._id
        if (othersUserId.toString() === myUserId.toString()) {
            return res.status(400).json({ error: 'you can not follow yourself' })
        }
        const othersDetail = await UserModel.findByIdAndUpdate(othersUserId, { $addToSet: { followers: myUserId } }, {
            new: true
        });
        const myDetail = await UserModel.findByIdAndUpdate(myUserId, { $addToSet: { following: othersUserId } }, {
            new: true
        })
        return res.status(200).json({ result: othersDetail, myDetail });
    } catch (error) {
        console.log(error)
    }
})

//unfollow user
router.post('/user/:id/unfollow', ProtectedRoute, async (req, res) => {
    try {
        const othersUserId = req.params.id;
        const myUserId = req.user._id
        const othersDetail = await UserModel.findByIdAndUpdate(othersUserId, { $pull: { followers: myUserId } }, {
            new: true
        });
        const myDetail = await UserModel.findByIdAndUpdate(myUserId, { $pull: { following: othersUserId } }, {
            new: true
        })
        return res.status(200).json({ result: othersDetail, myDetail })
    } catch (error) {
        console.log(error)
    }

})

//edit user details
router.put('/user/:id/edit', ProtectedRoute, async (req, res) => {
    try {
        const { Name, location, DOB } = req.body
        const userId = req.params.id;
        if (userId.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: 'You are not authorised to update user details' })
        }
        const updatedDetails = await UserModel.findByIdAndUpdate(userId, { $set: { Name: Name, location: location, DOB: DOB } }, {
            new: true
        })
        return res.status(200).json({ result: updatedDetails })
    } catch (error) {
        console.log(error)
    }
})
//upload pic
router.post('/user/:id/uploadProfilePic', ProtectedRoute, async (req, res) => {
    try {
        const userId = req.params.id;
        const { profilePicture } = req.body;
        if (!profilePicture) {
            return res.status(400).json({ error: 'select the image first' })
        } else if (userId.toString() === req.user._id.toString()) {
            const detailImage = await UserModel.findByIdAndUpdate(userId, { $set: { profilePicture } }, {
                new: true
            })
            return res.status(200).json({ result: detailImage })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/myDetails', ProtectedRoute, async (req, res) => {
    try {
        const userId = req.user._id
        const userData = await UserModel.findById(userId)
        if (!userData) {
            return res.status(400).json({ error: 'User not found' })
        }
        return res.status(200).json({ result: userData })
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;