const express = require('express');
const pool = require('./database.js');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users'); // Запрос к базе данных
        res.json(rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(rows[0]); // Возвращаем добавленную запись
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});