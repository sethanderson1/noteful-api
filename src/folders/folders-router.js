const path = require('path')
const express = require('express')
const xss = require('xss')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => {
    return {
        id: folder.id,
        folder_name: xss(folder.folder_name),
    }
}
foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getAllFolders(knexInstance)
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { folder_name } = req.body
        const newFolder = { folder_name }

        for (const [key, value] of Object.entries(newFolder))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeFolder(folder))
            })
            .catch(next)
    })

// foldersRouter
//     .route('/:note_id')
//     .all((req, res, next) => {
//         NoteService.getById(
//             req.app.get('db'),
//             req.params.note_id
//         )
//             .then(note => {
//                 if (!note) {
//                     return res
//                         .status(404)
//                         .json({
//                             error: {
//                                 message: `Note doesn't exist`
//                             }
//                         })
//                 }
//                 res.note = note
//                 next()
//             })
//             .catch(next)
//     })
//     .get((req, res, next) => {
//         res.status(200).json(serializeNote(res.note))
//     })
//     .delete((req, res, next) => {
//         NoteService.deleteNote(
//             req.app.get('db'),
//             req.params.note_id
//         )
//             .then(numRowsAffected => {
//                 res.status(204).end()
//             })
//             .catch(next)
//     })
//     .patch(jsonParser, (req, res, next) => {
//         const { title, content } = req.body
//         const noteToUpdate = { title, content }

//         const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
//         if (numberOfValues === 0) {
//             return res.json({
//                 error: {
//                     message: `Request body must either contain 'title or 'content'`
//                 }
//             })
//         }
//         NoteService.updateNote(
//             req.app.get('db'),
//             req.params.note_id,
//             noteToUpdate
//         )
//         .then(numRowsAffected=> {
//             res.status(204).end()
//         })
//         .catch(next)
// })

module.exports = foldersRouter
