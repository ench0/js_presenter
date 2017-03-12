// var mysql      = require('mysql');

// var pool  = mysql.createPool({
//   connectionLimit : 10,
//   host            : 'localhost',
//   user            : 'icci',
//   password        : 'icci',
//   database        : 'icci_icci'
// });
 
// console.log("finished init");

// var result =
// pool.query('SELECT id, name, status FROM pages LIMIT 5', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: \n', results);
// });

// // module.exports = handle_database();

//   console.log(result);
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'icci',
  password : ''
});

function getDriver(callback) {    
    connection.query("SELECT * FROM icci",
        function (err, rows) {
            //here we return the results of the query
            callback(err, rows); 
            console.log(rows);
        }
    );    
}
