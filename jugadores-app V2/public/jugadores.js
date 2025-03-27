import { socket } from './socket-client.js';

async function cargarJugadores() {
    try {
        const response = await fetch('/obtener-jugadores');
        const jugadores = await response.json();
        const jugadoresList = document.getElementById('jugadores-list');
        jugadoresList.innerHTML = '';

        jugadores.forEach(jugador => {
            const card = document.createElement('div');
            card.className = 'jugador-card';
            card.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <p>Media: <strong>${jugador.media}</strong></p>
            `;
            jugadoresList.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar jugadores:', error);
    }
}

window.addEventListener('DOMContentLoaded', cargarJugadores);
window.addEventListener('nuevoJugadorRecibido', cargarJugadores);