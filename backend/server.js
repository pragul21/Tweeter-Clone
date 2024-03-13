const express = require('express')
const app = express()
const PORT = 4000;
const mongoose = require('mongoose')
const cors = require('cors')
const { MONGODB_URL } = require('./config')

global.__basedir = __dirname
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log("DB connected")
})
mongoose.connection.on('error', (error) => {
    console.log('Some error while connecting to DB')
})

mongoose.set('strictQuery', false);

require('./models/user_model')
require('./models/tweet_model')
app.use(cors());
app.use(express.json());

app.use(require('./routes/user_route'))
app.use(require('./routes/file_route'))
app.use(require('./routes/tweet_route'))

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})