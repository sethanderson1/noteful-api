require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const notesRouter = require('./notes/notes-router')
const foldersRouter = require('./folders/folders-router')
const usersRouter = require('./users/users-router')
const bcrypt = require('bcrypt')
const app = express()
const jwt = require('jsonwebtoken')

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

var checkAuthMiddleware = function (req, res, next) {
    let requestJWTToken
    const requestTokenHeader = req.headers['authorization']
    if (requestTokenHeader) {
        requestJWTToken = requestTokenHeader.split('Bearer ')[1]
    }
    if (requestJWTToken) {
        console.log(`checkAuthMiddleware`, requestJWTToken)
        try {
            var decoded = jwt.verify(requestJWTToken, process.env.ACCESS_TOKEN_SECRET);
            console.log(`decoded data:`, decoded) // bar
            
        } catch (error) {
            console.log('Bad token!')
        }
        req.user = decoded
        //find the user by the token-stored id and attach it to the request obj
    }
    // console.log('LOGGED')
    next()
}



app.use(checkAuthMiddleware)
app.use(`/api/notes`, notesRouter)
app.use(`/api/folders`, foldersRouter)

app.get('/', (req, res) => {

    res.send(req.user ? `Hi, ${req.user.name}` : 'Hello, world!')
})

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log('salt', salt)
        console.log('hashedPassword', hashedPassword)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch (err) {
        console.log('err', err)
        res.status(500).send()
    }
})


app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    const index = users.indexOf(user)
    if (user == null) {
        return res.status(400).send('cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.name
            const user = { name: username, index }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.json({ accessToken: accessToken })
            console.log('accessToken', accessToken)
            // res.send('success')
        } else {
            res.send('not allowed')
        }
    } catch (err) {
        console.log('err', err)
        res.status(500).send()
    }
})



app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app