const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'views')));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Letmein@dev@123',
    database: 'onwork-tracker',
    port: 1115
});

io.on('connection', (socket) => {
    console.log('A client connected');
    
    socket.on('fetchData', async () => {
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('CALL `onwork-tracker`.getURLCounts()');
            var result = rows[0];
            connection.release();

            if (Array.isArray(result) && result.length > 0) {
                const formattedData = result.map(row => ({
                    anshum: row.anshum,
                    gupta: row.gupta
                }));
                socket.emit('displayData', formattedData);
            } else {
                socket.emit('displayData', []); 
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
