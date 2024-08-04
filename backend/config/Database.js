import { Sequelize } from "sequelize";

const db = new Sequelize('kuis_db', 'root', '', {   
    host: 'localhost',
    dialect: 'mysql',
    
    });

export default db;