const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// ================= CONFIG PACKAGES ========================//

// CONNECTIONS
// mongoose.connect('mongodb+srv://gdc:23jLzhk2oYr0c9PE@belajaraja.ibkfhzp.mongodb.net/?retryWrites=true&w=majority&appName=belajarAja')
//       .then(() => console.log('Connected to MongoDB'))
//       .catch(err => console.error('Could not connect to MongoDB:', err));
mongoose.connect('mongodb://daffa:QPS8PYTfveJ5WNmZ@ac-cdnhfwk-shard-00-00.nftqbht.mongodb.net:27017,ac-cdnhfwk-shard-00-01.nftqbht.mongodb.net:27017,ac-cdnhfwk-shard-00-02.nftqbht.mongodb.net:27017/belajaraja?ssl=true&replicaSet=atlas-12mw8f-shard-0&authSource=admin&retryWrites=true&w=majority')
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Could not connect to MongoDB:', err));

// CONNECTIONS
// ================= CONFIG ROUTER ========================//
const UserRouter = require('./routes/UserRouter')
const CourseRouter = require('./routes/CourseRouter')

app.use('/api/user', UserRouter)
app.use('/api/course', CourseRouter)

app.listen(4000, () => {
      console.log("successfully connected")
})

