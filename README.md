## Full-Stack Challenge: Andrew MacIver

Time-spent: 7 hours, including research on express.js and additional middlewares
Bonus and refinements: 4 hours

### Instructions
* `npm install`
* additionally, if you want to reset the DB, `npm install`: `fs`, `jquery`, `jquery-csv` (these are not necessary to run the app so so I did not install them as dependencies)
* to reset the DB, run `node populate_db.js`
* `npm start`

### Features
* sqlite3 db
* frontend error-handling on inputs
* responsive layout
* new cars persist and appear on list
* backend error catching for blank inputs (just in case :)
* Chart.js to display prices data
* Did not use webpack, as a vanilla exercise



### Refinements TBD
* returning only the new car object to be appended onto the table instead of fetching all cars again
* validating year as integer
[X] bonus features with prices
[X] 'loading' status after post
[X] 'success' UI feature of some sort
