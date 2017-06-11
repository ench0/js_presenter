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
