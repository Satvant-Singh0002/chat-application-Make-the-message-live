document.getElementById('signupForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const name=document.getElementById('name').value;
    const phone=document.getElementById('phone').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const userObj={
        name,
        phone,
        email,
        password
    };
    try{
          const response = await axios.post('http://localhost:3000/api/signup',userObj);
    window.location.href='login.html';
    document.getElementById('signupForm').reset();

    }catch(err){
        if(err.response.status === 409){
            alert('user already exists');
        }else{
            alert('something went wrong');
        }
        console.log("signup error",err);

    }
  

});