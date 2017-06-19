var fs = require('fs');
var $ = jQuery = require('jquery');
require('jquery-csv');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cars.sqlite')


var sample = 'cars.csv';
fs.readFile(sample, 'UTF-8', function(err, csv) {
  db.serialize(function () {
    db.run('DROP TABLE cars');
    db.run('CREATE TABLE IF NOT EXISTS cars (id INT, make TEXT, model TEXT, year INT, color TEXT)')
    var stmt = db.prepare('INSERT INTO cars VALUES (?, ?, ?, ?, ?)')

    $.csv.toArrays(csv, {}, function(err, data) {
      for(var i=1, len=data.length; i<len; i++) {
        // console.log(data[i]);
        stmt.run(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4])
      }
    });


    stmt.finalize()

    db.each('SELECT rowid AS id, make, model, year, color FROM cars', function (err, row) {
      console.log(row.id + ': ' + row.make + ': ' + row.model+ ': ' + row.year+ ': ' + row.color)
    })
  })

  db.close()


});
