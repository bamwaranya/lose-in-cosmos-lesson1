const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
  { name: "1", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/1.png?alt=media&token=2cfe33fe-de11-44b3-a8ae-2a0d8a787d77" },
  { name: "2", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/2.png?alt=media&token=403be100-40a5-4430-bf0d-cfb0628afb6b" },
  { name: "3", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/3.png?alt=media&token=3bf97ef4-4492-4532-a978-4057f0bf1f13" },
  { name: "4", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/4.png?alt=media&token=234225c1-03e1-4bdc-9b3a-0dd634433577" },
  { name: "5", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/5.png?alt=media&token=dd32bc8b-a724-4e48-b5b7-3eba7ddb0971" },
  { name: "6", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/6.png?alt=media&token=5bb99a69-bf7d-42df-a0da-cb611f855dac" },
  { name: "1", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/7.png?alt=media&token=5b7521b3-5696-4044-bc16-96473ac9abad" },
  { name: "2", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/8.png?alt=media&token=76ff495b-575f-4e16-b19f-ab2289c544a7" },
  { name: "3", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/9.png?alt=media&token=9a9b21e2-d23f-4398-9154-06e247794d96" },
  { name: "4", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/10.png?alt=media&token=2fd4a74a-b797-4cda-bf0a-7761b9835ed1" },
  { name: "5", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/11.png?alt=media&token=1e125796-12dc-4c1d-a729-ed6c1bfc9882" },
  { name: "6", image: "https://firebasestorage.googleapis.com/v0/b/lost-in-cosmos.appspot.com/o/12.png?alt=media&token=8f8b96c8-3b30-4d0e-bb2e-7bf96e6307a6" },
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = () => {
    const shuffledItems = items.sort(() => Math.random() - 0.5);
    const selectedItems = shuffledItems.slice(0, 12);
  
    // Duplicate selectedItems to create pairs
    const cardValues = [...selectedItems];
  
    return cardValues;
  };

  const matrixGenerator = (cardValues, rows = 3, cols = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues];
    // Simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < rows * cols; i++) {
      // Create Cards
      gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
            <img src="${cardValues[i].image}" class="image"/>
          </div>
        </div>`;
    }
    // Grid
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `
                <a href="https://www.canva.com/design/DAFolpkJgRU/8v2m1R-zOGVZTFgVXUAtYA/view?website#4" target="_blank">
                  <h4>Moves: ${movesCount}  <br> Times: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}  </h4>
                </a>`;
              stopGame();
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
 
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};