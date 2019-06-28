const ShoppingListService = {
    getAllItems(knexInstance) {
        return knexInstance.select('*').from('shopping_list')
    },

    insertItem(knexInstance, newItem) {
        return knexInstance
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knexInstance, itemID) {
        return knexInstance
            .from('shopping_list')
            .select('*')
            .where('id', itemID)
            .first()
    },

    deleteItem(knexInstance, id) {
        return knexInstance('shopping_list')
            .where({ id })
            .delete()
    },

    updateItem(knexInstance, id, newItemFields) {
        return knexInstance('shopping_list')
            .where({ id })
            .update(newItemFields)
    },
}

module.exports = ShoppingListService