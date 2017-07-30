const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


const db = {};

// connect to postgres db
const sequelize = new Sequelize(process.env.POSTGRES_DB,process.env.POSTGRES_USER,process.env.POSTGRES_PASSWORD, {
    dialect: 'postgres',
    host:process.env.POSTGRES_HOST,
    port:process.env.POSTGRES_PORT,
});

const modelsDir = path.normalize(`${__dirname}/../models`);

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter(file => (file.indexOf('.') !== 0) && (file.indexOf('.map') === -1))
    // import model files and save model names
    .forEach((file) => {
        console.log(`Loading model file ${file}`);
        const model = sequelize.import(path.join(modelsDir, file));
        db[model.name] = model;
    });

// Synchronizing any model changes with database.
sequelize
    .sync()
    .then((err) => {
        if (err) console.log('An error occured %j', err);
        else console.log('Database synchronized');
    });

// assign the sequelize variables to the db object and returning the db.
db.sequelize = sequelize;
module.exports = db;