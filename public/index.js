const backgroundColors = {
    grass: '#5FBD58',
    bug: '#92BC2C',
    dark: '#595761',
    dragon: '#0C69C8',
    electric: '#F2D94E',
    fairy: '#EE90E6',
    fighting: '#D3425F',
    fire: '#DC872F',
    flying: '#A1BBEC',
    ghost: '#5F6DBC',
    ground: '#DA7C4D',
    ice: '#75D0C1',
    normal: '#A0A29F',
    poison: '#B763CF',
    psychic: '#FF2CA8',
    rock: '#A38C21',
    steel: '#5695A3',
    water: '#539DDF'
}

ninePokemons = ''
pokemonList = []

function processPokemon(data) {
    ninePokemons += '<div class="cardContainer">'

    if (data.types.length == 1) {
        ninePokemons += `<div class="pokemonContainer" style="background-color: ${backgroundColors[data.types[0].type.name]}">`
    } else {
        ninePokemons += `<div class = "pokemonContainer"
        style = "background-image: linear-gradient(to bottom right, ${backgroundColors[data.types[0].type.name]}, ${backgroundColors[data.types[1].type.name]}">`
    }
    // console.log(data)
    ninePokemons += `
    <a href="./pokemon/${data.id}">
    <h1 class="pokemonName">${data.name.toUpperCase()}</h1>
    <img src="${data.sprites.other['official-artwork'].front_default}">
    <h2 class="pokemonID">${data.id}</h2>
    </a>
    </div>
    </div>
    `
}

async function loadNinePokemons() {
    for (i = 1; i <= 9; i++) {
        if (i % 3 == 1) {
            ninePokemons += '<div class="pokemonCol">'
        }

        pokemonID = Math.ceil(Math.random() * 26)

        while (pokemonList.includes(pokemonID)) {
            pokemonID = Math.ceil(Math.random() * 26)
        }
        pokemonList.push(pokemonID)

        await $.ajax({
            type: 'GET',
            url: `https://warm-lowlands-28229.herokuapp.com/api/pokemon/id/${pokemonID}`,
            success: processPokemon
        })

        if (i % 3 == 0) {
            ninePokemons += '</div>'
        }
    }
    $('main').html(ninePokemons)
}

function setup() {
    loadNinePokemons()
}

$(document).ready(setup)