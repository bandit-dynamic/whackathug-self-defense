// Dependencies
const express = require('express')
const app = express();
const methodOverride = require('method-override')
require('dotenv').config();
const Moves = require('./models/moves.js');
const movesController = require('./controllers/moves.js')
const session = require('express-session')
const usersController = require('./controllers/users.js')
const path = require('path')


// Sessions
// http is a stateless protocol
// this means that the protocol itself doesn't track who's making the request, or what requests have been made
// we need a way to give it stateful behavior
// we need it to track what the user has already done
// we're going to do this using cookies and sessions
// a cookie is basically a string that the server sends to the browser, and thn the browsers sends that back
// we're going to use cookies to identify particular users in what we call "sessions"
const SESSION_SECRET = process.env.SESSION_SECRET
// console.log('Here is the session secret')
console.log(SESSION_SECRET)
app.use(session({
    secret: SESSION_SECRET,
    resave: false, 
    saveUninitialized: false // https://www.npmjs.com/package/express-session#resave
}))

// this middleware will attache a cookie to our response
// which will then get saved by the user's browser
// the browser will then send it back in its requests
// the server will then be able to identify the user
// using cookies
// think of the cookies like a key or maybe an ID card

// when the server gets a request, it checks for cookies
// and if it finds and attaches a session object
// to the request object
// we can use the session object to track information
// about the user

const mongoose = require('mongoose');
console.log(process.env.MONGODB_URL)
// Database Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
mongoose.set('strictQuery', true);

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
//Body parser: Add JSON data from request to the request object
app.use(express.json())
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
// method override 
// This will allow us to make DELETE and PUT requests
app.use(methodOverride('_method'))
app.use('/moves', movesController)
app.use('/users', usersController)
app.use(express.static(path.join(__dirname, 'public')))

// routes were here



// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`));