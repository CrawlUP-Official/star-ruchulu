const dotenv = require('dotenv');
// Configure dotenv to load before calling db config
dotenv.config();

const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB Connection before spin up
db.getConnection()
    .then(connection => {
        console.log(`✅ MySQL Database Connected successfully on HOST: ${process.env.DB_HOST}`);
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Star Ruchulu Backend running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`❌ DB Connection Error: ${err.message}`);
        process.exit(1);
    });
