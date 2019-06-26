require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})


const searchTerm = 'cheatloaf';
function searchItemsWithText(searchTerm) {
    knexInstance
      .select('*')
      .from('shopping_list')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(`Search For '${searchTerm}' Items\n------------------------`);
        console.log(result)
      })
}
//searchItemsWithText(searchTerm);


const pageNumber = 2;
function paginateItems(page) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (page - 1)
    knexInstance
      .select('*')
      .from('shopping_list')
      .limit(itemsPerPage)
      .offset(offset)
      .then(result => {
        console.log(`Page ${page}: (${itemsPerPage} items)\n------------------------`);
        console.log(result)
      })
}
//paginateItems(pageNumber);

/* -------------------------------- */

function itemsAddedAfterDate(daysAgo) {
    knexInstance
      .select('name', 'date_added')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
      )
      .from('shopping_list')
      .then(result => {
        console.log(`Items Added After ${daysAgo} Days Ago\n------------------------`);
        console.log(result)
      })
}
const numDaysAgo = 5;
//itemsAddedAfterDate(numDaysAgo);

/* -------------------------------- */

function categoryTotalCost() {
  knexInstance
    .select('category')
    .groupBy('category')
    .from('shopping_list')
    .sum('price AS total')
    .then(result => {
      console.log('Total Cost Per Category\n------------------------');
      console.log(result);
    })
}
categoryTotalCost();