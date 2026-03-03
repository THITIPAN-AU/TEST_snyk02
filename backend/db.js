// MOCKUP FOR SNYK SECURITY TESTING ONLY
const mysql = require('mysql');

// [VULN] Hardcoded DB credentials
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1234',
  database: 'registration_db'
});

connection.connect(err => {
  if (err) { console.error('DB Error:', err.stack); return; }
  console.log('Connected as id ' + connection.threadId);
});

// [VULN] SQL Injection - string concatenation
function findUserByEmail(email, callback) {
  const query = "SELECT * FROM users WHERE email = '" + email + "'";
  console.log('Query:', query);
  connection.query(query, callback);
}

// [VULN] SQL Injection in INSERT
function createUser(username, email, password, callback) {
  const query = "INSERT INTO users (username, email, password) VALUES ('"
    + username + "', '" + email + "', '" + password + "')";
  connection.query(query, (err, results) => {
    if (err) callback(err.message, null);
    else callback(null, results);
  });
}

// [VULN] SQL Injection via unsanitized id
function getUserById(id, callback) {
  const query = "SELECT * FROM users WHERE id = " + id;
  connection.query(query, callback);
}

module.exports = { findUserByEmail, createUser, getUserById, connection };
