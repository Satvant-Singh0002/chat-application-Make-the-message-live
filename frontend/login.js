document.getElementById('loginForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const login=document.getElementById('login').value;
    console.log("login",login);
    const password=document.getElementById('password').value;

    const loginObj={
        login,
        password
    };
    try{

        const response = await axios.post('http://localhost:3000/api/login',loginObj);
        localStorage.setItem('token', response.data.token);
        console.log("LOGIN RESPONSE:", response.data);
        localStorage.setItem("userId", response.data.userId);
         window.location.href="users.html";

    }catch(err){
          console.log("LOGIN ERROR:", err);
        if(err.response?.status === 404){
            alert('user not found');
        }else{
            alert('password incorrect');
        }
       

    }
})