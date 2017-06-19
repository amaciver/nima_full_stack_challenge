const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cars.sqlite')

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)')
  var stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i)
  }

  stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info)
  })
})

db.close()

app.use(express.static('public'))

// ROUTES: FEEL FREE TO ADD MORE ROUTES AS YOU SEE FIT

// Index route for static page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

// Route to get cars list
app.get("/cars", function (req, res) {
  // TODO: Implement getting cars
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
