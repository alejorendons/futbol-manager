class Jugador {
    constructor(nombre, puntaje) {
        this.nombre = nombre;
        this.puntaje = puntaje;
    }
}

function crearTarjetaJugador(jugador) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.nombre = jugador.nombre;
    card.dataset.puntaje = jugador.puntaje;
    card.textContent = `${jugador.nombre} (${jugador.puntaje})`;

    card.addEventListener("click", function() {
        card.classList.toggle("selected");
    });

    return card;
}

function cargarJugadores() {
    fetch('/obtener-jugadores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los jugadores.');
            }
            return response.json();
        })
        .then(jugadores => {
            // Ordenar jugadores por puntaje de mayor a menor
            jugadores.sort((a, b) => b.media - a.media);

            let jugadoresContainer = document.getElementById("jugadoresContainer");
            jugadoresContainer.innerHTML = "";

            jugadores.forEach(jugadorData => {
                let jugador = new Jugador(jugadorData.nombre, parseInt(jugadorData.media, 10));
                let card = crearTarjetaJugador(jugador);
                jugadoresContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al cargar los jugadores:', error);
            alert('Hubo un problema al cargar los jugadores.');
        });
}

function obtenerJugadoresSeleccionados() {
    let jugadoresSeleccionados = [];
    let cards = document.querySelectorAll(".card.selected");

    cards.forEach(card => {
        let nombre = card.dataset.nombre;
        let puntaje = parseInt(card.dataset.puntaje, 10);
        jugadoresSeleccionados.push(new Jugador(nombre, puntaje));
    });

    return jugadoresSeleccionados;
}

function calcularMediaEquipo(equipo) {
    if (equipo.length === 0) return 0;
    return equipo.reduce((total, jugador) => total + jugador.puntaje, 0) / equipo.length;
}

function encontrarEquiposAleatorios(jugadoresSeleccionados) {
    let equipo1 = [];
    let equipo2 = [];

    let shuffledJugadores = shuffle(jugadoresSeleccionados);

    shuffledJugadores.forEach((jugador, index) => {
        if (index % 2 === 0) {
            equipo1.push(jugador);
        } else {
            equipo2.push(jugador);
        }
    });

    return [equipo1, equipo2];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function generarEquipos() {
    let jugadoresSeleccionados = obtenerJugadoresSeleccionados();

    if (jugadoresSeleccionados.length !== 10) {
        alert("Debes seleccionar exactamente 10 jugadores para generar los equipos.");
        return;
    }

    let [equipo1, equipo2] = encontrarEquiposAleatorios(jugadoresSeleccionados);

    mostrarEquipo(equipo1, "jugadoresEquipo1", "mediaEquipo1");
    mostrarEquipo(equipo2, "jugadoresEquipo2", "mediaEquipo2");
}

function mostrarEquipo(equipo, idListaJugadores, idMediaEquipo) {
    let listaJugadores = document.getElementById(idListaJugadores);
    let mediaEquipo = document.getElementById(idMediaEquipo);

    listaJugadores.innerHTML = "";
    equipo.forEach(jugador => {
        let li = document.createElement("li");
        li.textContent = `${jugador.nombre}: ${jugador.puntaje}`;
        listaJugadores.appendChild(li);
    });

    mediaEquipo.textContent = `Media global: ${calcularMediaEquipo(equipo).toFixed(2)}`;
}

window.onload = function() {
    cargarJugadores();

    let generarEquiposBtn = document.getElementById("generarEquiposBtn");
    generarEquiposBtn.addEventListener("click", generarEquipos);
};
