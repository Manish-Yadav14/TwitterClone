let name = document.getElementById('name');
let email = document.getElementById('email');

const token = localStorage.getItem('token');

let decodedToken = JSON.parse(atob(token?.split(".")[1]));
name.innerText = decodedToken?.name;
email.innerText =decodedToken?.email;