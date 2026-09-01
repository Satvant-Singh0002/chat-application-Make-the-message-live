
const getUsers=async()=>{
    try {
        
        const token=localStorage.getItem('token');
        console.log("Token:", token);
        const response = await axios.get("http://localhost:3000/users/getUsers",
            {

            headers :{
                Authorization:token
            }
        }
        );
        console.log('response.data',response.data);
        const users=response.data.users;
        displayUsers(users);
        
    } catch (error) {
        console.log(error);
        
    }
}

const displayUsers=(users)=>{

    const usersList=document.getElementById('userList');
    usersList.innerHTML="";
     users.forEach(user => {

        const userDiv = document.createElement("div");

        userDiv.classList.add("user-item");

        userDiv.innerHTML = `
            <div class="user-name">
                ${user.name}
            </div>
        `;

        userDiv.addEventListener("click", () => {

            

            // Store selected receiver
             localStorage.setItem("selectedUserId", user.id);
              localStorage.setItem("selectedUserName", user.name);

            window.location.href = "chatwindow.html";

           

        });

        usersList.appendChild(userDiv);

    });
    
}


getUsers();