const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json());
app.use(cors());

// Registro de endpoints
app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/product', productRoutes);

app.get('/v1', (req, res) => {
    res.send('API Backend Digital College v1.0 running');
});

// Tratamento de endpoint não encontrado
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Tratamento de exceção global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
