## Full-Stack Challenge: Andrew MacIver

Time-spent: 7 hours, including research on express.js and additional middlewares

### Instructions
* `npm install`
* additionally, if you want to reset the DB, `npm install`: `fs`, `jquery`, `jquery-csv` (these are not necessary to run the app so so I did not install them as dependencies)
* to reset the DB, run `node populate_db.js`
* `npm start`

### Features
* sqlite3 db
* frontend error-handling on inputs
* responsive layout
* backend error catching for blank inputs (just in case :)


### Refinements TBD
* returning only the new car object to be appended onto the table instead of fetching all cars again
* validating year as integer
* bonus features with prices
