const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('cars.sqlite')


app.use(express.static('public'))

// ROUTES: FEEL FREE TO ADD MORE ROUTES AS YOU SEE FIT

// Index route for static page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

// Route to get cars list
app.get("/cars", function (req, res) {
  db = new sqlite3.Database('cars.sqlite')
  let data = {}
  let dbPromise = new Promise( (resolve, reject) => {

    db.all('SELECT id, make, model, year, color FROM cars', (err, rows) => {
      rows.forEach( (row) => {
        data[row.id] = { make: row.make, model: row.model, year: row.year }
      })

    // console.log(data);
    resolve(data)
    })

  })
  dbPromise.then( (data) => res.send(data))

  db.close()

})

// Route to add car to list
app.post("/cars", function (req, res) {
  // TODO: Implement adding a car
  res.send("Posting cars")
})

// Route to get prices
app.get("/prices", function (req, res) {
  // TODO: (BONUS) Implement getting price of a car
  res.send("Getting prices")
})

//MAIN:
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
