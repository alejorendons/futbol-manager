document.getElementById('playerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const media = document.getElementById('media').value;

    const data = { nombre, media };

    try {
        const response = await fetch('/guardar-jugador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Jugador guardado exitosamente.');
            document.getElementById('playerForm').reset();
        } else {
            alert('Hubo un problema al guardar el jugador.');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
