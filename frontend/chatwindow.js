const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('messages');

form.addEventListener('submit',async function(event){
    event.preventDefault();
    const text= input.value.trim();
    //empty message sent nhi krna hai
    if(text===""){
        return;
    }
   const userId = localStorage.getItem("userId");

    try {
       
        const response= await axios.post('http://localhost:3000/api/addMessage',
            {
                userId:userId,
                messages:text
            });
    
    //create new message
    const message=document.createElement("div");
    message.classList.add("message","sent");
    // curent time
    const now= new Date();

    const time =now.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });
    message.innerHTML=`
    <p>${text}</p>
    <span>${time}</span>
    
    `;
    // messages ko chat mein add krna
    messages.appendChild(message);
    // input value ko clear kiya
    input.value="";

    //messages scorll
    messages.scrollTop=messages.scrollHeight;
    //input pr foucus
    input.focus();

    } catch (error) {
        console.log(error);
        
    }



});

// const sendMessage=async()=>{
//     const inputValue=document.getElementById('messageInput').value;
//     try {
//         const userId = localStorage.getItem("userId");
//         const response= await axios.post('http://localhost:3000/api/addMessage',
//             {
//                 userId:userId,
//                 messages: inputValue
//             });
//     document.getElementById('messageInput').value = '';
    
//     } catch (error) {
//         console.log(error);
        
//     }
// }
// const sendButton=document.getElementById('sendBtn');
// sendButton.addEventListener('click',sendMessage);