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
  let dbPromise = new Promise( (resolve, reject) => {
    db.all('SELECT id, make, model, year, color FROM cars', (err, rows) => {
      rows.forEach( (row) => {
        data[row.id] = { make: row.make, model: row.model, year: row.year }
      })
    resolve(data);
    })
  })
  dbPromise.then( (data) => res.send(data) );
  db.close();
})

// Route to add car to list
app.post("/cars", function (req, res) {
  console.log(req.body);


  res.json({success : "Updated Successfully", status : 200});
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
