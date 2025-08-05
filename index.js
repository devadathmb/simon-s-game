// Variables Declaration
let buttonsActive = true;
var buttonColors = ["red", "green", "blue", "yellow"];
var gamePattern = [];
var userPattern = [];
var gameRunning = false;
var levelNum = 0;
var clickCount = 0;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Main function
function main() {
  if (!gameRunning) {
    $(document).on("keypress", startGame);
  } else {
    alert("game running");
  }
}

// Function for resetting values and starting the game from level 1
function startGame() {
  gameRunning = true;
  levelNum = 0;
  gamePattern = [];
  userPattern = [];
  nextSequence();
  $(document).off("keypress", startGame);
}

// Funcion for starting level
function nextSequence() {
  levelNum += 1;
  clickCount = 0;
  userPattern = [];

  $("#level-title").text("Level " + levelNum);

  var randomNumber = Math.floor(Math.random() * 4); //random value generation for making game pattern
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  setTimeout(() => {
    showPattern();
  }, 300);
}

// fucntion for showing the pattern that needs to be repeated
async function showPattern() {
  var delayTime = 1000 / Math.ceil(levelNum / 2);
  for (let i = 0; i < gamePattern.length; i++) {
    let color = gamePattern[i];
    flashingAnimation(color);
    playSound(color);

    // Check if it's the last iteration
    if (i < gamePattern.length - 1) {
      await delay(delayTime);
    }
  }

  buttonsActive = true;
}

// Functiopn that checks each button click
function buttonClicked(clickedButton) {
  if (!gameRunning) {
    startGame();
  } else {
    var userChosenColor = $(clickedButton).attr("id");

    flashingAnimation(userChosenColor);
    playSound(userChosenColor);

    userPattern.push(userChosenColor);
    checkAnswer(levelNum);
  }
}

// Function that checks the entered answer is correct and in order
function checkAnswer(levelNum) {
  if (userPattern[clickCount] === gamePattern[clickCount]) {
    clickCount += 1;
    if (clickCount >= levelNum) {
      buttonsActive = false;
      correctAnswer();
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    wrongAnswer();
  }
}

// function that is executed when wrong button is clicked
function wrongAnswer() {
  buttonsActive = false;

  playSound("wrong");
  $("body").addClass("wrong-answer");
  setTimeout(() => {
    $("body").removeClass("wrong-answer");
  }, 100);

  gameRunning = false;
  $("#level-title").html("Wrong guess! <br> Press any key to play again");

  setTimeout(() => {
    $(document).on("keypress", startGame);
    buttonsActive = true;
  }, 1000);
}

// function that is executed when the enetered pattern is fully correct
function correctAnswer() {
  $("body").addClass("correct-answer");
  setTimeout(() => {
    $("body").removeClass("correct-answer");
  }, 100);
}

// function that makes the buttons flash
function flashingAnimation(buttonId) {
  $("#" + buttonId).addClass("pressed");
  setTimeout(() => {
    $("#" + buttonId).removeClass("pressed");
  }, 100);
}

// Variables and function for sounds in the webpage for each button and events
var sounds = {
  red: new Audio("sounds/red.mp3"),
  green: new Audio("sounds/green.mp3"),
  blue: new Audio("sounds/blue.mp3"),
  yellow: new Audio("sounds/yellow.mp3"),
  wrong: new Audio("sounds/wrong.mp3"),
};
function playSound(chosenColor) {
  if (sounds[chosenColor]) {
    sounds[chosenColor].play();
  } else {
    console.log(chosenColor);
  }
}

$("button").on("click", function (event) {
  if (!buttonsActive) return;
  buttonClicked(event.target);
});

main();
