const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-sch", "root", "ashish@1234", {
  dialect: "mysql",
  host: "localhost",
});

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-sch",
//   password: "ashish@1234",
// });

// module.exports = pool.promise();
module.exports = sequelize;
