const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const app = express()
const knex = require('knex')

const postgres = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'facial-recognition'
    },
});

// console.log(postgres.select('*').from('users'))

app.use(express.json())
app.use(cors())

// const database = {
//     users: [
//         {
//             id: 123,
//             name: 'John',
//             email: 'john@email.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: 124,
//             name: 'Sally',
//             email: 'sally@email.com',
//             password: 'safepass',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {

    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //     res.json(database.users[0])
    // }else{
    //     res.status(400).json('error logging in')
    // }
    postgres.select('email','hash').from('login')
        .where('email','=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password , data[0].hash)
            // console.log(isValid) 
            if(isValid){
                return postgres.select('*').from('users')
                    .where('email','=',req.body. email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }
            else{
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const {email , name , password} = req.body
    const hash = bcrypt.hashSync(password);
    postgres.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
    })
    // database.users.push({
    //     id: '125',
    //     name: name,
    //     email: email,
    //     password: password,
    //     entries: 0,
    //     joined: new Date()
    // })
})


// Load hash from your password DB.
// bcrypt.compare("bacon", "$2a$10$xFo2bjSDKSdosGecmLeb7ujzGij5g1Q6W.J2CWzYajMyG4pPU2k1a", function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", "$2a$10$xFo2bjSDKSdosGecmLeb7ujzGij5g1Q6W.J2CWzYajMyG4pPU2k1a", function(err, res) {
//     // res = false
// });

app.get('/profile/:id', (req, res) => {
    const {id} = req.params
    let found = false
    // database.users.forEach(user => {
    //     if(Number(user.id) === Number(id)){
    //         found = true
    //         return res.json(user)
    //     } 
    // })
    postgres.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
                res.json(user[0])
            }
            else{
                res.status(404).json('Not found')
            }
        })
        .catch(err => res.status(400).json('No such user'))
    // if (found === false){
    //     res.status(404).json(' no such user')
    // }
})

app.put('/image', (req, res) => {
    const {id} = req.body
    // let found = false
    // database.users.forEach(user => {
    //     if(Number(user.id) === Number(id)){
    //         found = true
    //         user.entries++
    //         return res.json(user.entries)
    //     } 
    // })
    // if (found === false){
    //     res.status(404).json(' not found')
    // }
    postgres('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err =>res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})