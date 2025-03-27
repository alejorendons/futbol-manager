import { socket } from './socket-client.js';

document.getElementById('playerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const media = document.getElementById('media').value;

    try {
        const response = await fetch('/guardar-jugador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, media })
        });

        if (response.ok) {
            alert('Jugador guardado exitosamente');
            document.getElementById('playerForm').reset();
        } else {
            alert('Error al guardar jugador');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
});