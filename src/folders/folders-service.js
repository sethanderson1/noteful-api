const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('folders')
    },

    insertFolder(knex,newFolder) {
        return knex
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {

    },

    deleteFolder(knex, id) {

    },

    updateFolder(knex, id, newFolderFields) {

    } 

}

module.exports = FoldersService