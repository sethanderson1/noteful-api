const path = require('path')
const express = require('express')
const xss = require('xss')
// const FoldersService = require('./folders-service')

const usersRouter = express.Router()
const jsonParser = express.json()

// const serializeFolder = folder => {
//     return {
//         id: folder.id,
//         folder_name: xss(folder.folder_name),
//     }
// }

// const users = []



module.exports = usersRouter
