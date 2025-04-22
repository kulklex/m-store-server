const express = require('express')
const mongoose = require('mongoose')

// Import routes
const userRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/order')
const paystackRoutes = require('./routes/paystack')
const postRoutes = require('./routes/posts')
const commentsRoutes = require('./routes/comment')
const likesRoutes = require('./routes/likes')
const followRoutes = require('./routes/follows')
const notificationRoutes = require('./routes/notifications')
const bookmarkRoutes = require('./routes/bookmark')


const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const app = express()


dotenv.config()

app.use(bodyParser.json({
    limit: "30mb",
    extended:true
}))

app.use(bodyParser.urlencoded({
    limit: "30mb",
    extended: true
}))


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Cors should be above your middleware
app.use(cors())

app.get('/', (req, res) => {
    res.send("APP IS RUNNING")
})

app.use('/api/auth', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/paystack', paystackRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/likes', likesRoutes)
app.use('/api/follows', followRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/bookmarks', bookmarkRoutes)

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 3000


mongoose.connect(CONNECTION_URL)
.then(() => app.listen(PORT, console.log(`Server running on port ${PORT}...`)))
.catch((err) => {console.error(err.message)})