const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/jugadoresDB'; 

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

const jugadorSchema = new mongoose.Schema({
    nombre: String,
    media: Number
});

const Jugador = mongoose.model('Jugador', jugadorSchema);


app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.post('/guardar-jugador', async (req, res) => {
    try {
        const { nombre, media } = req.body;
        const nuevoJugador = new Jugador({ nombre, media });
        await nuevoJugador.save();
        res.send('Jugador guardado exitosamente en MongoDB');
    } catch (err) {
        console.error('❌ Error al guardar el jugador:', err);
        res.status(500).send('Error al guardar el jugador');
    }
});


app.get('/obtener-jugadores', async (req, res) => {
    try {
        const jugadores = await Jugador.find();
        res.json(jugadores);
    } catch (err) {
        console.error('❌ Error al obtener jugadores:', err);
        res.status(500).send('Error al obtener los jugadores');
    }
});


app.listen(PORT, () => {
    console.log(`✅ Servidor HTTP corriendo en http://localhost:${PORT}`);
});
