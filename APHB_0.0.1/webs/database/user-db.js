const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("user-db", "user", "pass", {
  dialect: "sqlite",
  host: "./database/user-db.sqlite",
});

module.exports = sequelize;
