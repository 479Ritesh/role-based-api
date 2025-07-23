require('dotenv').config(); 

const config = {

  HOST: process.env.DB_HOST , 
  USER: process.env.DB_USER ,
 PASSWORD: process.env.DB_PASSWORD ,
  DB: process.env.DB_NAME ,
  PORT: parseInt(process.env.DB_PORT) || 3306, 
};

module.exports = config;