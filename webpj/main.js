// JavaScript
const loginform = document.getElementById("loginform");
const login = document.getElementById("login");
const welcome = document.getElementById("welcome");
const logout = document.getElementById("logout"); 
const pokedex = document.getElementById("pokedex"); 
const mainboll = document.getElementById("mainboll")

loginform.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = login.value;

  fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => {
    const exists = users.some(user => user.name === name);
    if (!exists) {
      fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify({ name: name }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(user => {
        loginform.style.display = "none";
        welcome.innerText = `환영합니다, ${user.name}님!`;
        welcome.style.display = "block";
        logout.style.display = "block"; 
        localStorage.setItem("current_user", user.name);
      });
    } else {
      loginform.style.display = "none";
      welcome.innerText = `환영합니다, ${name}님!`;
      welcome.style.display = "block";
      logout.style.display = "block"; 
      localStorage.setItem("current_user", name);
    }
  });
});

logout.addEventListener("click", function() { 
  localStorage.removeItem('current_user');
  loginform.style.display = "block";
  welcome.style.display = "none";
  logout.style.display = "none"; 
});

window.addEventListener('beforeunload', function() {
  localStorage.removeItem('current_user');
});

const current_user = localStorage.getItem("current_user");
current_user ? (loginform.style.display = "none", welcome.innerText = `환영합니다, ${current_user}님!`, welcome.style.display = "block", logout.style.display = "block") : (loginform.style.display = "block", welcome.style.display = "none", logout.style.display = "none");

pokedex.addEventListener('click', function(event) {
  if (!localStorage.getItem("current_user")) {
    event.preventDefault();
    alert("로그인부터 해주세요.");
  } else {
    window.open('pokedex/pokedex.html')
  }
});

mainboll.addEventListener('click', function(e){
  if (!localStorage.getItem("current_user")){
    e.preventDefault();
    alert("로그인 먼저 해주세요.")
  }else{
    mainboll.style.transition = "1s"
    mainboll.style.transform = "rotate(360deg)"
    setTimeout(() => {
      window.open('pokemongame/index.html')
      mainboll.style.transition ="1s"
      mainboll.style.transform = "rotate(0deg)"
    },1200)
  }
})