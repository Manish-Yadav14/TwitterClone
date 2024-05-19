let cnfmsg = document.getElementById('cnfmsg');
const renderConfirmation = ()=>{
    let msg =  `<div id="alert" class="alert alert-info alert-dismissible fade show" role="alert">
    <strong>Success!</strong> You have been Successfully Registered. Login Now!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    cnfmsg.innerHTML = msg;
    setTimeout(() => {
        cnfmsg.innerHTML = "";
    }, 3000);
};

let register = document.getElementById('user-form');
register.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('pwd').value;

    try {
        const res = await axios.post('/register',{name,email,password});
        console.log(res);
        if(res.status === 201){
            renderConfirmation();
        }  
    } catch (error) {
        console.log(error);
        alert("error with signup");
    }
})


