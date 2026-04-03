const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-sch", "root", "As3466610", {
  dialect: "mysql",
  host: "localhost",
});

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-sch",
//   password: "As3466610",
// });

// module.exports = pool.promise();
module.exports = sequelize;
