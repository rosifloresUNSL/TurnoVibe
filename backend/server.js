const express = require('express');
const app = express();

app.get('/', (req, res) => res.json({ mensaje: 'TurnoVibe API funcionando' }));

app.listen(3000, () => console.log('Escuchando en http://localhost:3000'));