
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')


describe(`Shopping List service object`, function () {
    let testItems= [
        {
            id: 1,
            name: 'Doritos',
            price: '2.50',
            category: 'Breakfast',
            checked: false,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'Cheetos',
            price: '3.50',
            category: 'Breakfast',
            checked: false,
            date_added: new Date('2029-02-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'Fritos',
            price: '4.50',
            category: 'Breakfast',
            checked: false,
            date_added: new Date('2029-03-22T16:28:32.615Z')
        },        
    ]

    let db;

    // Before starting anything, connect to the database
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    // Before we insert values, make sure table is empty
    before(() => db('shopping_list').truncate())

    // After each test, make sure table is empty
    afterEach(() => db('shopping_list').truncate())

    // After we've inserted values, disconnect from database
    after(() => db.destroy())

    // Test case when table has data
    context(`Given 'shopping_list' has data`, () => {
        // Before testing, insert values
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        // Verify we can retrieve all items
        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        // Verify we can retrieve an item by its ID
        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        category: thirdTestItem.category,
                        price: thirdTestItem.price,
                        checked: thirdTestItem.checked,
                        date_added: thirdTestItem.date_added
                    })
                })
        })

        // Verify we can delete an item by its ID
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    // copy the test items array without the "deleted" item
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        // Verify we can update an item
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                id: idOfItemToUpdate,
                name: 'Cool Ranch Fritos',
                category: 'Lunch',
                price: '36.00',
                checked: true,
                date_added: new Date('2022-02-22T16:28:32.615Z')
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                id: 1,
                name: 'Pan Fried Chips',
                category: 'Breakfast',
                price: '0.99',
                checked: true,
                date_added: new Date('2021-02-22T16:28:32.615Z')
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        category: newItem.category,
                        price: newItem.price,
                        checked: newItem.checked,
                        date_added: newItem.date_added
                    })
                })
        })
    })
})