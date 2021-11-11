//autor: Juan Vazquez Fernandez

window.onload = buscarPeliculas;

const app = document.getElementById('root');
const app2 = document.getElementById('root2');
let tablaPaginas = document.getElementById('listingTable')

const logo = document.createElement('img');
logo.src = 'capflix.png';

let container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);
app2.appendChild(container);

let api = 'https://omdbapi.com/?apikey=1934c54e';
let tipo = '&type=movie';
let busqueda = 'indiana';
let busquedaPrefix = '&s=';
let paginaPrefix = '&page=';
let paginaNum = 1;
let paginas;

function paginacion() {
    tablaPaginas.innerHTML = "";

    let indicador = document.createElement('p')
    indicador.id = "page";
    var pageText = document.createTextNode("Pagina: ");
    var pagNum = document.createTextNode(paginaNum);
    tablaPaginas.appendChild(indicador);
    indicador.appendChild(pageText);
    indicador.appendChild(pagNum);

    var salto = document.createElement("br");
    tablaPaginas.appendChild(salto)

    let pagAnt = document.createElement('a');
    pagAnt.href = "javascript:paginaAnterior()";
    pagAnt.id = "btn_ant";
    var linkTextAnt = document.createTextNode("<--");
    pagAnt.appendChild(linkTextAnt);
    tablaPaginas.appendChild(pagAnt)

    var espacio = document.createTextNode("   ");
    tablaPaginas.appendChild(espacio)

    let pagSig = document.createElement('a');
    pagSig.href = "javascript:paginaSiguiente()";
    pagSig.id = "btn_sig";
    var linkTextSig = document.createTextNode("-->");
    pagSig.appendChild(linkTextSig);
    tablaPaginas.appendChild(pagSig)

}

function paginaSiguiente() {
    if (paginaNum < paginas) {
        paginaNum += 1;
        buscarPeliculas();
    }
}

function paginaAnterior() {
    if (paginaNum > 1) {
        paginaNum -= 1;
        buscarPeliculas();
    }
}

function pulsar(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        var boton = document.getElementById("search");
        boton.click();
    }
}

function filtrarBusqueda() {
    var busquedaFiltrada = document.getElementById('searchterm').value;
    busqueda = busquedaFiltrada.replace(/\s/g, "+")
    paginaNum = 1;
    buscarPeliculas();
}

function buscarPeliculas() {
    container.innerHTML = "";
    var request = new XMLHttpRequest();
    request.open('GET', api + tipo + busquedaPrefix + busqueda + paginaPrefix + paginaNum);
    console.log(api + tipo + busquedaPrefix + busqueda + paginaPrefix + paginaNum)
    request.onload = function () {

        // Begin accessing JSON data here
        var data = JSON.parse(request.response);
        if (request.status >= 200 && request.status < 400) {

            paginas = Math.floor(data["totalResults"] / 10);
            if (data["totalResults"] % 10 !== 0) {
                paginas += 1;
            }
            data["Search"].forEach(movie => {
                var request2 = new XMLHttpRequest();
                request2.open('GET', api + '&i=' + movie.imdbID, true);
                request2.onload = function () {

                    var specificMovie = JSON.parse(request2.response);

                    var card = document.createElement('div');
                    card.setAttribute('class', 'card');
                    container.appendChild(card);

                    if (specificMovie["Poster"] !== "N/A") {
                        var poster = document.createElement('img');
                        poster.setAttribute('class', 'poster');

                        poster.src = specificMovie["Poster"];
                        card.appendChild(poster);
                    }

                    var h1 = document.createElement('h1');
                    h1.textContent = specificMovie.Title;

                    var p = document.createElement('p');
                    p.textContent = specificMovie.Year + " - " + specificMovie["Director"];

                    var plot = document.createElement('p');
                    plot.textContent = specificMovie["Plot"];

                    card.appendChild(h1);
                    card.appendChild(p);
                    card.appendChild(plot);
                }

                request2.send();
            });
        } else {
            var errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Vaya por Dios, ha habido un ERROR! `;
            app.appendChild(errorMessage);
        }

    }
    request.send();
    paginacion();
}

