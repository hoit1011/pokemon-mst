const pokedex = document.getElementById("pokedex")
const getPokemon = () => {
  const promises = []
  for (let i = 1; i <= 1010; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`
    promises.push(fetch(url).then(res => res.json()))
  }
  Promise.all(promises).then(result => {
    const pokemon = result.map(data => ({
      id: data.id,
      name: data.name,
      image: data.sprites["front_default"],
    }))
    displayPokemon(pokemon)
  })
}

const displayPokemon = async pokemon => {
  const user_id = JSON.parse(localStorage.getItem('current_user_id'));
  
  // 사용자 정보 가져오기
  const userResponse = await fetch(`http://localhost:3000/users/${user_id}`);
  const user = await userResponse.json();
  const userPokemonIds = user ? user.pokemon : [];

  const pokemonString = pokemon
    .map(
      singlePokemon => `
    <li>
      <img src="${singlePokemon.image}" style="${userPokemonIds.includes(singlePokemon.id) ? '' : 'filter: grayscale(100%)'}" />
      <h3>${singlePokemon.id}. ${singlePokemon.name} </h3>
    </li>`
    )
    .join("");
  pokedex.innerHTML = pokemonString;
}



getPokemon()
