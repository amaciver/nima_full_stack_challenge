const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
let db = new sqlite3.Database('cars.sqlite')


app.use(express.static('public'));
app.use(bodyParser());

// Index route for static page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

// Route to get cars list
app.get("/cars", function (req, res) {
  db = new sqlite3.Database('cars.sqlite')
  let data = {};
  db.all('SELECT rowid, make, model, year, color FROM cars', (err, rows) => {
    rows.forEach( (row) => {
      data[row.rowid] = { make: row.make, model: row.model, year: row.year }
    })
  res.send(data);
  db.close();
  })
})

// Route to add car to list
app.post("/cars", function (req, res) {
  if (req.body.make === '' || req.body.model === '' || req.body.year === '') {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    db = new sqlite3.Database('cars.sqlite')
    let stmt = db.prepare('INSERT INTO cars VALUES (?, ?, ?, ?)')
    stmt.run(req.body.make, req.body.model, req.body.year, 'clear', function(err) {
      res.json({success : "Updated Successfully", status : 200, car: {id: this.lastID, make: req.body.make, model: req.body.model, year: req.body.year}});
      stmt.finalize();
      db.close();
    })
  }
})

// Route to get prices
app.get("/prices", function (req, res) {
  db = new sqlite3.Database('cars.sqlite')
  const carId = parseInt(Object.keys(req.query)[0])
  let data = {};
  db.all(`SELECT prices.rowid, prices.year, prices.price, cars.make, cars.model, cars.year AS car_year FROM prices JOIN cars ON cars.rowid = prices.car_id WHERE prices.car_id = ${carId}`, (err, rows) => {
    if (rows !== undefined) {
      rows.forEach( (row) => {
      data[row.rowid] = { car_year: row.car_year, make: row.make, model: row.model, year: row.year, price: row.price }
      })
    }
  res.send(data);
  db.close();
  })
})

//MAIN:
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
