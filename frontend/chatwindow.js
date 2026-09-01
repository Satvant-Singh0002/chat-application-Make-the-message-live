


// ======================================
// WebSocket Connection
// ======================================

const socket = new WebSocket("ws://localhost:3000");


// WebSocket Connected
socket.onopen = () => {

    console.log("WebSocket connected");

};


// WebSocket Message Received
socket.onmessage = async (event) => {

    try {

        // WebSocket data is coming as Blob
        const text = await event.data.text();

        console.log("Message received through WebSocket:", text);

        // Show received message on screen
        createMessage(
            text,
            new Date(),
            "received"
        );

    } catch (error) {

        console.log("WebSocket message error:", error);

    }

};


// WebSocket Error
socket.onerror = (error) => {

    console.log("WebSocket error:", error);

};


// WebSocket Closed
socket.onclose = () => {

    console.log("WebSocket closed");

};


// ======================================
// Get HTML Elements
// ======================================

const form = document.getElementById("messageForm");

const input = document.getElementById("messageInput");

const messages = document.getElementById("messages");


// ======================================
// Get User Information
// ======================================

// Logged-in user
const loggedInUserId = localStorage.getItem("userId");

// User selected from users.html
const selectedUserId = localStorage.getItem("selectedUserId");

const selectedUserName = localStorage.getItem("selectedUserName");


console.log(
    "Logged-in User ID:",
    loggedInUserId
);

console.log(
    "Selected User ID:",
    selectedUserId
);

console.log(
    "Selected User Name:",
    selectedUserName
);


// ======================================
// Check Logged-in User
// ======================================

if (!loggedInUserId) {

    alert("User is not logged in.");

    window.location.href = "login.html";

}


// ======================================
// Check Selected User
// ======================================

if (!selectedUserId) {

    alert("Please select a user first.");

    window.location.href = "users.html";

}


// ======================================
// Show Selected User Name
// ======================================

const chatUserName =
    document.getElementById("chatUserName");


if (chatUserName) {

    chatUserName.textContent =
        selectedUserName || "Unknown User";

}


// ======================================
// Get Previous Messages
// ======================================

async function getMessages() {

    try {

        const response = await axios.get(
            `http://localhost:3000/api/GetMessages/${loggedInUserId}/${selectedUserId}`
        );


        console.log(
            "GET MESSAGES:",
            response.data
        );


        // Clear existing messages
        messages.innerHTML = "";


        // Display previous messages
        response.data.forEach(data => {

            const message =
                document.createElement("div");


            // ======================================
            // Check Sender
            // ======================================

            if (
                String(data.senderId) ===
                String(loggedInUserId)
            ) {

                // Message sent by logged-in user
                message.classList.add(
                    "message",
                    "sent"
                );

            } else {

                // Message received from selected user
                message.classList.add(
                    "message",
                    "received"
                );

            }


            // ======================================
            // Message Time
            // ======================================

            const time =
                new Date(
                    data.createdAt
                ).toLocaleTimeString([], {

                    hour: "2-digit",

                    minute: "2-digit"

                });


            // ======================================
            // Message HTML
            // ======================================

            message.innerHTML = `
                <p>${data.messages}</p>
                <span>${time}</span>
            `;


            messages.appendChild(message);

        });


        // Scroll to bottom
        messages.scrollTop =
            messages.scrollHeight;


    } catch (error) {

        console.log(
            "GET MESSAGE ERROR:",
            error.response?.data || error
        );

    }

}


// ======================================
// Create Message On Screen
// ======================================

function createMessage(
    text,
    createdAt,
    type
) {

    const message =
        document.createElement("div");


    message.classList.add(
        "message",
        type
    );


    // ======================================
    // Message Time
    // ======================================

    const time =
        new Date(
            createdAt
        ).toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

        });


    // ======================================
    // Message HTML
    // ======================================

    message.innerHTML = `
        <p>${text}</p>
        <span>${time}</span>
    `;


    messages.appendChild(message);


    // Scroll to bottom
    messages.scrollTop =
        messages.scrollHeight;

}


// ======================================
// Send Message
// ======================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Get input value
        const text =
            input.value.trim();


        // Don't send empty message
        if (text === "") {

            return;

        }


        console.log(
            "Sending message:",
            text
        );

        console.log(
            "Sender ID:",
            loggedInUserId
        );

        console.log(
            "Receiver ID:",
            selectedUserId
        );


        try {

            // ======================================
            // 1. Save Message In Database
            // ======================================

            const response =
                await axios.post(
                    "http://localhost:3000/api/addMessage",
                    {

                        senderId:
                            Number(loggedInUserId),

                        receiverId:
                            Number(selectedUserId),

                        messages:
                            text

                    }
                );


            console.log(
                "SEND MESSAGE RESPONSE:",
                response.data
            );


            // ======================================
            // 2. Send Message Through WebSocket
            // ======================================

            if (
                socket.readyState ===
                WebSocket.OPEN
            ) {

                socket.send(text);


                console.log(
                    "Message sent through WebSocket:",
                    text
                );

            } else {

                console.log(
                    "WebSocket is not open"
                );

            }


            // ======================================
            // 3. Show Message On Sender Screen
            // ======================================

            createMessage(
                text,
                new Date(),
                "sent"
            );


            // ======================================
            // 4. Clear Input
            // ======================================

            input.value = "";


            // ======================================
            // 5. Focus Input
            // ======================================

            input.focus();


        } catch (error) {

            console.log(
                "SEND MESSAGE ERROR:",
                error.response?.data || error
            );

        }

    }
);


// ======================================
// Load Previous Messages
// ======================================

getMessages();
