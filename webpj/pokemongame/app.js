const current_user = localStorage.getItem("current_user")
const user_id = localStorage.getItem("current_user_id")
document.getElementById("user").innerText = `user = ${current_user}`

function getRandomPosition() {
  let y = 700;
  let x = 1550;
  let randomX = Math.floor(Math.random() * x);
  let randomY = Math.floor(Math.random() * y);
  return [randomX, randomY];
}

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let pokemonid
let pokemonname

async function updateImage() {
  const promises = []
  for (let i = 1; i <= 1010; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`
    promises.push(fetch(url).then(res => res.json()))
  }
  const result = await Promise.all(promises);
  const pokemon = result.map(data => ({
    id: data.id,
    name: data.name,
    image: data.sprites["front_default"],
  }))
  let randomNumber = Math.floor(Math.random() * 1010) + 1;
  let imgurl = pokemon[randomNumber].image
  pokemonid = pokemon[randomNumber].id
  pokemonname = pokemon[randomNumber].name
  
  let target = document.querySelector('.target');
  target.src = imgurl;
  target.style.display = 'block' 
  target.style.width = '120px'
  target.style.height = '120px'

  console.log(randomPos)

  randomPos = getRandomPosition();
  console.log(randomPos)

  target.style.left = randomPos[0] + 'px';
  target.style.top =  randomPos[1]+ 'px';

  let randomContainer = document.querySelector('.random');
  randomContainer.innerHTML = '';
  randomContainer.appendChild(target);

  let randomInterval = getRandomInterval(3000, 7000);
  console.log(randomInterval)

  timerId = setTimeout(updateImage, randomInterval);
}

let bollclickx
let bollclicky
let clickEventstop = true;
let excus = document.getElementById("time")


let clickEvent = async(e) => {
  img = document.createElement('img')
  img.src = 'img/pokemonboll.png'
  img.classList.add('boll-img')
  img.style.display = 'block'
  img.style.position = 'fixed'
  img.style.top = (e.clientY - 25) + 'px';
  img.style.left = (e.clientX - 25) + 'px';
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.transition = 'transform 1s';
  
  bollclickx = (e.clientX - 50)
  bollclicky = (e.clientY - 50)

  document.body.appendChild(img)

  console.log("클릭" + bollclickx)
  console.log("클릭" + bollclicky)

  clearTimeout(timerId)

  setTimeout(() => {
    img.style.transform = 'scale(0.7) rotate(180deg)'
  }, 1)

  document.removeEventListener('click', clickEvent)
  
  await catchpokemon(img)


  img.style.display = 'none'


  let countdown = 5.0
  
  let intervalId = setInterval(function() {
    countdown -= 0.1; 
    excus.textContent = countdown.toFixed(1); 

    if (countdown <= 0) { 
      clearInterval(intervalId); 
      excus.textContent = "다시 몬스터볼을 던질수 있습니다!"; 
    }
  }, 100);

  setTimeout(() => {
    document.addEventListener('click',clickEvent)
  },5000)
  
  console.log(e.clientX - 50)
  console.log(e.clientY - 50)
}

let randomPos = getRandomPosition();

const catchpokemon = (img) => {
  return new Promise((resolve) => {
    let randomX = randomPos[0];
    let randomY = randomPos[1];
    console.log(randomX)
    console.log(randomY)
    if(Math.abs(randomX - bollclickx) < 50 && Math.abs(randomY - bollclicky) < 50){ 
      let img = document.querySelector('.boll-img');  
      let target = document.querySelector('.target'); 
      excus.textContent = "캐치 성공 !"
      target.style.display = 'none'
      img.style.display = 'block'
      img.style.transition = 'transform 1s';
      img.style.zIndex = 10;  
      setTimeout(() => { img.style.transform = 'scale(0.7) rotate(360deg)'; }, 1);
      setTimeout(() => {
        swing(img)
      },1000)
      setTimeout(() => {
        if(Math.random() > 0.05){
          console.log("1")
          setTimeout(() => {
            swing(img)
          },500)
          setTimeout(() => {
            if(Math.random() > 0.1){
              console.log("2")
            setTimeout(() => {
              swing(img)
            },500)
            setTimeout(() => {
              swing(img)
            },2000)
            //포켓몬이 잡힘
            setTimeout(() => {
              excus.textContent = `${pokemonname}이 잡혔습니다`
              img.style.filter = 'grayscale(80%)';
              starExplosion(img)
              }, 3500);
            setTimeout(() => {
              fetch(`http://localhost:3000/users/${user_id}`)
                .then(response => response.json())
                .then(user => {
                  if (!user.pokemon) user.pokemon = [];
                  console.log("아아아아아")
                  user.pokemon.push(pokemonid);
                  fetch(`http://localhost:3000/users/${user_id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                  })
                  .catch(error => console.error('Error:', error));
                })
                .catch(error => console.error('Error:', error));
            },4500)
          }
            else{
              console.log("놓쳤습니다 ! ")
              setTimeout(() => {
                runpokemon(img,target,resolve)
              },1000)
            }
          },1500)
        }
        else{
          console.log("놓쳤습니다 ! ")
          setTimeout(() => {
            runpokemon(img, target, resolve);
        }, 1000)
        }
      },2000)
    }else{
      setTimeout(() => {
        img.remove()
      },1000)
      setTimeout(resolve,1000);
      setTimeout(updateImage,1500)
    }
  })
}

const swing = (img) => {
  console.log('실행')
  img = document.querySelector('.boll-img');
  img.style.transition = 'transform 0.5s'
  setTimeout(() => {excus.textContent = "포켓몬을 잡는중."},200)
  setTimeout(() => {excus.textContent = "포켓몬을 잡는중.."},400)
  setTimeout(() => {excus.textContent = "포켓몬을 잡는중..."},600)

  setTimeout(() => {
    img.style.transform = 'scale(0.7) rotate(320deg)'
  },1)
  setTimeout(() => {
    img .style.transform = 'scale(0.7) rotate(400deg)'
  },500)
}

const runpokemon = (img, target, resolve) => {
  console.log('false')
  img.remove()
  excus.textContent = "포켓몬이 도망갔어요... 다시 잡아보세요!"
  target.style.display = 'block'
  setTimeout(() => {
      target.style.display = 'none'
  },500)
  setTimeout(resolve,1000);
  setTimeout(updateImage,3000)
}

function starExplosion(img) {
  for (let i = 0; i < 10; i++) {
    let star = document.createElement('img');
    star.src = 'img/star.jpeg'; 
    star.style.position = 'fixed';
    star.style.display = 'block';
    star.style.width = '10px';
    star.style.height = '10px';
    star.style.top = (img.offsetTop + 25 - 5) + 'px'; 
    star.style.left = (img.offsetLeft + 25 - 5) + 'px';
    star.style.transition = 'all 1s linear';

    // 별이 퍼져나가는 방향을 랜덤하게 설정합니다.
    let angle = Math.random() * 2 * Math.PI;
    let distance = 100;

    document.body.appendChild(star);
    
    setTimeout(function() {
      star.style.top = (img.offsetTop + 25 - 5 + Math.sin(angle) * distance) + 'px';
      star.style.left = (img.offsetLeft + 25 - 5 + Math.cos(angle) * distance) + 'px';
    }, 1);

    setTimeout(function() {
      star.remove();
    }, 1000);
  }
}


document.addEventListener('click', clickEvent);

updateImage()