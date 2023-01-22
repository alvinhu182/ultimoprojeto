import { Sequelize } from 'sequelize';
const mongoose = require("mongoose");
require('dotenv').config()

//const sequelize = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.MYSQL_DB}`, {
//    dialect: 'mysql'
//});

const sequelize = new Sequelize(`mysql://root:1234@localhost:3306/candyshopbackend`,{
    dialect: 'mysql'
});

mongoose.connect("mongodb://localhost:27017/report-database")

const mongooseDb = mongoose.connection;

export {
    sequelize,
    mongooseDb
};