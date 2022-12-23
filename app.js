import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { errorHandler } from './middlewares/errorHandler.js'
dotenv.config()

const app = express()
const PORT = 4444

const sessionSecret = process.env.SESSION_SECRET

const dbURI = process.env.MONGODB_URI
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbURI,
    collection: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}))

app.get('/', (req, res) => {
  console.log('asd')
  if (req.session.viewCount) {
    req.session.viewCount++
    res.send(`<h1>You have visited this page ${req.session.viewCount + 1} times</h1>`)
  } else {
    req.session.viewCount = 1
    res.send(`<h1>You have visited this page ${req.session.viewCount} times</h1>`)
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
  mongoose.set('strictQuery', false)
  mongoose.connect(dbURI, dbOptions)
  console.log('Connected to MongoDB')
})
