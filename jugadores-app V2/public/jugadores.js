window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/obtener-jugadores');
        if (response.ok) {
            const jugadores = await response.json();
            const jugadoresList = document.getElementById('jugadores-list');

            jugadores.forEach(jugador => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${jugador.nombre} (${jugador.media})</h3>`;
                jugadoresList.appendChild(card);
            });
        } else {
            alert('Error al cargar los jugadores.');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
