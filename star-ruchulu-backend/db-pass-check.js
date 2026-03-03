const mysql = require('mysql2/promise');

const passwords = ['root', '', 'password', 'yourpassword', '123456', '1234', '12345', 'admin', 'root123', 'root@123', 'mysql'];

async function testPasswords() {
    for (const p of passwords) {
        try {
            const conn = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: p,
            });
            console.log(`Success with password: "${p}"`);
            await conn.end();
            return p;
        } catch (err) {
            console.error(`Failed with "${p}": ${err.message}`);
        }
    }
}

testPasswords();
