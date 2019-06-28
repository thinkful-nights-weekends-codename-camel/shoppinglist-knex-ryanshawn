require('dotenv').config()

const knex = require('knex')
const ShoppingListService = require('./shopping-list-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

// use all the ShoppingListService methods!!
ShoppingListService.getAllItems(knexInstance)
  .then(items => console.log(items))
  .then(() =>
  ShoppingListService.insertItem(knexInstance, {
      name: 'Doritos',
      price: 2.50,
      category: 'Breakfast',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    })
  )
  .then(newItem => {
    console.log(newItem)
    return ShoppingListService.updateItem(
      knexInstance,
      newItem.id,
      { name: 'Strawberry Doritos' }
    ).then(() => ShoppingListService.getById(knexInstance, newItem.id))
  })
  .then(item => {
    console.log(item)
    return ShoppingListService.deleteItem(knexInstance, item.id)
  })