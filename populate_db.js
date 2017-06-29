const fs = require('fs');
const $ = jQuery = require('jquery');
require('jquery-csv');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('cars.sqlite')

let cars = 'cars.csv';
fs.readFile(cars, 'UTF-8', function(err, csv) {
  db.serialize(function () {
    db.run('DROP TABLE IF EXISTS cars');
    db.run('CREATE TABLE IF NOT EXISTS cars (make TEXT, model TEXT, year INT, color TEXT)')
    let stmt = db.prepare('INSERT INTO cars VALUES (?, ?, ?, ?)')

    $.csv.toArrays(csv, {}, function(err, data) {
      for(let i=1, len=data.length; i<len; i++) {
        stmt.run(data[i][1], data[i][2], data[i][3], data[i][4])
      }
    });

    stmt.finalize()

    db.each('SELECT rowid AS id, make, model, year, color FROM cars', function (err, row) {
      console.log(row.id + ': ' + row.make + ': ' + row.model+ ': ' + row.year+ ': ' + row.color)
    })
  })
});

let prices = 'prices.csv';
fs.readFile(prices, 'UTF-8', function(err, csv) {
  db.serialize(function () {
    db.run('DROP TABLE IF EXISTS prices');
    db.run('CREATE TABLE IF NOT EXISTS prices (car_id INT, year INT, price INT)')
    let stmt = db.prepare('INSERT INTO prices VALUES (?, ?, ?)')

    $.csv.toArrays(csv, {}, function(err, data) {
      for(let i=1, len=data.length; i<len; i++) {
        stmt.run(parseInt(data[i][0])+1, data[i][1], data[i][2])
      }
    });

    stmt.finalize()

    db.each('SELECT rowid AS id, car_id, year, price FROM prices', function (err, row) {
      console.log(row.id + ': ' + row.car_id + ': ' + row.year+ ': ' + row.price)
    })
  })

  db.close()
});
