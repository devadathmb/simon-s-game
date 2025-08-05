var buttonColors = ["red", "green", "blue", "yellow"];
var gamePattern = [];
var userPattern = [];
var gameRunning = false;
var levelNum = 0;
var clickCount = 0;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function game() {
  $(document).on("keypress", function () {
    if (!gameRunning) {
      gameRunning = true;
      levelNum = 0;
      gamePattern = [];
      userPattern = [];
      nextSequence();
    } else {
      alert("game running");
    }
  });
}

function nextSequence() {
  levelNum += 1;
  clickCount = 0;
  userPattern = [];
  $("#level-title").text("Level " + levelNum);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  showPattern();
}

async function showPattern() {
  var delayTime = (1000 / levelNum)
  for (let color of gamePattern) {
    flashingAnimation(color);
    playSound(color);
    await delay(delayTime);
  }
}

function buttonClicked(clickedButton) {
  var userChosenColor = $(clickedButton).attr("id");

  flashingAnimation(userChosenColor);
  playSound(userChosenColor);

  userPattern.push(userChosenColor);
  checkAnswer(levelNum);
}

function checkAnswer(levelNum) {
  if (userPattern[clickCount] === gamePattern[clickCount]) {
    clickCount += 1;
    if (clickCount >= levelNum) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    wrongAnswer();
  }
}

function flashingAnimation(buttonId) {
  $("#" + buttonId).addClass("pressed");
  setTimeout(() => {
    $("#" + buttonId).removeClass("pressed");
  }, 100);
}

function wrongAnswer() {
  playSound("wrong");
  $("body").addClass("wrong-answer");
  setTimeout(() => {
    $("body").removeClass("wrong-answer");
  }, 100);

  gameRunning = false;
  $("#level-title").html("Wrong guess! <br> Press any key to play again");
}

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

$("button").click(function (event) {
  buttonClicked(event.target);
});

game();
