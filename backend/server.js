require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB(); // 🔴 这一行【一定要有，而且在 routes 之前】

app.use(express.json());

app.use('/db-test', require('./routes/dbTest'));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
