const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const app = express()
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const postgres = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    },
});

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {res.send('It is Working')})
app.post('/signin', (req, res) => {signin.handleSignin(req, res, postgres, bcrypt)})
app.post('/register', (req, res) => {register.handleRegister(req, res, postgres, bcrypt)})
app.get('/profile/:id',  (req, res) => {profile.handleProfileGet(req, res, postgres)})
app.put('/image', (req, res) => {image.handleImage(req, res, postgres)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

//Default Port for checking
// app.listen(3000, () => {
//     console.log('app is running on port 3000')
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})

console.log(PORT)