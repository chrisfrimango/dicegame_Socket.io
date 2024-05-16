const socket = io();

// DOM elements
const mainContent = document.querySelector("#mainContent");
const tableBody = document.querySelector("#scoreTable tbody");
const userContainer = document.querySelector("#userContainer");
const user = document.querySelector("#user");
const userNameInput = document.querySelector("#nameInput");
const errorMsg = document.querySelector("#errorMsg");
const userWelcome = document.querySelector("#userWelcome");
const chatMessageForm = document.querySelector("#chatMessageForm");
const chatMessageInput = document.querySelector("#chatMessageInput");
const sendMessageButton = document.querySelector("#sendMessageButton");
const chatErrorMsg = document.querySelector("#chatErrorMsg");
const chat = document.querySelector("#chat");
const diceButton = document.querySelector("#roll");
const diceButtonReset = document.querySelector("#reset");
const diceImg = document.querySelector("#diceImg");
const score = document.querySelector("#score");
const diceResult = document.querySelector("#diceResult");
const winnerMsg = document.querySelector("#winnerMsg");

// format date
const formDate = (value) => {
  const dateStr = value;
  const date = new Date(dateStr);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
};

// get all users and data
const getUsers = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/users");
    const data = await response.json();
    console.log(data);

    if (data) {
      const sortedList = data
        .filter((user) => user.score > 0)
        .sort((a, b) => b.score - a.score);

      sortedList.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${user.userName}</td><td>${
          user.score
        }</td><td>${formDate(user.date)}</td>`;
        tableBody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
getUsers();

// add new user
const addNewUser = async (url, userName) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName }),
    });
    if (!response.ok) {
      errorMsg.textContent = "Username is taken, please choose another one.";
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// create user
let currentUser = "";

// Update UI
const updateUI = (userName, string = null) => {
  mainContent.classList.remove("hidden");
  userContainer.style.display = "none";
  userWelcome.textContent = `Hey ${
    string ? string : ""
  } ${userName}, lets roll!`;
  currentUser = userName;
  userNameInput.value = "";
};

// check existing user
const checkExistingUser = async (userName) => {
  console.log("checkExistingUser", userName);
  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${userNameInput.value}`
    );
    const data = await response.json();
    console.log(data.exists);
    console.log(data);
    if (data.exists) {
      updateUI(userName, "again");
      // errorMsg.textContent = "Username is taken, please choose another one.";
    } else {
      addNewUser("http://localhost:3000/api/users", userName);
      updateUI(userName);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// user form
user.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("user submitted:", userNameInput.value);

  if (userNameInput.value === "" || userNameInput.value.length < 2) {
    errorMsg.textContent = "Please enter your name, min 2 characters";
  } else {
    checkExistingUser(userNameInput.value);
  }
});

// chat message form
chatMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (chatMessageInput.value) {
    socket.emit("chatMessage", {
      user: currentUser,
      message: chatMessageInput.value,
    });
    console.log("message from User in chat, frontend", chatMessageInput.value);
    chatMessageInput.value = "";
  } else {
    chatErrorMsg.textContent = "Please enter a message";
  }
});

socket.on("newChatMessage", (msg) => {
  console.log(msg);
  const li = document.createElement("li");
  li.textContent = `${msg.user}: ${msg.message}`;
  chat.appendChild(li);
});

// save to highscore
const saveToHighscore = async (userName, score) => {
  console.log("saveToHighscore", userName, score);
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, score: score }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

let sum = 0;
let counter = 0;

// reset game
const reset = () => {
  diceButton.disabled = false;
  diceButton.style.opacity = 1;
  sum = 0;
  diceResult.textContent = `Total score: ${sum}`;
  score.innerHTML = "";
  winnerMsg.textContent = "";
};

// count dice score
const count = (randomNumber, count) => {
  sum += randomNumber;
  console.log(sum);
  diceResult.textContent = `Total score: ${sum}`;
  if (sum >= 50) {
    diceButton.disabled = true;
    diceButton.style.opacity = 0.5;
    score.innerHTML = "";
    winnerMsg.textContent = `Congratulations ${currentUser}, you rolled ${count} times!`;
    saveToHighscore(currentUser, count);
  } else {
    return sum;
  }
};

// dice roll
diceButton.addEventListener("click", () => {
  counter++;
  console.log("counter", counter);
  diceImg.classList.add("rotating");

  setTimeout(() => {
    diceImg.classList.remove("rotating");
  }, 500);
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  console.log(randomNumber);

  socket.emit("diceScore", {
    user: currentUser,
    score: randomNumber,
  });

  diceImg.src = `/dice${randomNumber}.png`;
});

socket.on("newDiceScore", (msg) => {
  console.log(msg);
  if (sum < 50) {
    const li = document.createElement("li");
    li.textContent = `${msg.user}: ${msg.score}`;
    score.appendChild(li);
    count(msg.score, counter);
  }
});

// reset button
diceButtonReset.addEventListener("click", () => {
  reset();
});
