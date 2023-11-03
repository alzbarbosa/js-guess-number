// Constants for elements
const numberOfGuessesElement = document.getElementById("number-of-guesses");
const guessedNumbersElement = document.getElementById("guessed-numbers-user");
const messageAlert = document.getElementById("message-alert");
const messageSubHeader = document.getElementById("sub-header");
const historyComputerNumbers = document.getElementById("computer-numbers"); //
const userInput = document.getElementById("user-input");
const guessButton = document.getElementById("guess-button");
const newGameButton = document.getElementById("new-game-button");

// Start game configuration
const initialMessage = "Which number am I thinking?";
let minValueNumber = 1;
let maxValueNumber = 100;
let computerGuessedNumber = randomNumber(minValueNumber, maxValueNumber);
let guessedNumbers = [];
let currentGuessCount = 0;
let computerGeneratedNumbers = [];
messageAlert.textContent = initialMessage;
messageSubHeader.textContent = `Try to guess a number between ${minValueNumber} and ${maxValueNumber}.`;

// Return a random number between minimum value and the parameter max
function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function checkGuess() {
  const userGuess = parseInt(userInput.value);
  console.log(userGuess);
  console.log(computerGuessedNumber);

  // Clear the input for the next
  clearInput(userInput);

  // Check if the number is in the range of the minimum and maximum number
  if (!userGuess || userGuess < minValueNumber || userGuess > maxValueNumber) {
    updateMessageAlert(
      `Please enter a number between ${minValueNumber} and ${maxValueNumber}.`,
      "alert-danger"
    );
    return;
  }

  // Update the guessed numbers and current count
  guessedNumbers.push(userGuess);
  currentGuessCount++;

  // Update the display for number of guesses
  numberOfGuessesElement.textContent = currentGuessCount;

  // Update the display for guessed numbers
  guessedNumbersElement.textContent = guessedNumbers.join(", ");

  // Compares user number with computer numbers and procede according the result
  if (userGuess === computerGuessedNumber) {
    updateMessageAlert(
      `Congratulations! You guessed it! - The number was ${computerGuessedNumber}`,
      "alert-success"
    );
    updateRecord(currentGuessCount);
    updateComputerChosenNumbers(computerGuessedNumber);
    userInput.disabled = true;
    guessButton.disabled = true;
  } else if (userGuess < computerGuessedNumber) {
    updateMessageAlert("Too low!", "alert-warning");
  } else {
    updateMessageAlert("Too high!", "alert-warning");
  }
}

// Function to check if the current winner count guesses beats the record, and update the record accordingly
function updateRecord(guessCount) {
  // Retrieve the record from local storage, or set it to a high number by default
  let recordGuesses =
    parseInt(localStorage.getItem("guessGameRecord")) || Infinity;

  // Check if the current guess count is less than the record guess count
  if (guessCount < recordGuesses) {
    // Save the new record to local storage
    localStorage.setItem("guessGameRecord", guessCount.toString());
    // Update the record display on the page
    displayRecord();
  }
}

function updateComputerChosenNumbers(chosenNumber) {
  // Add the chosen number to the array and update localStorage
  computerGeneratedNumbers.push(chosenNumber);
  localStorage.setItem(
    "computerGeneratedNumbers",
    JSON.stringify(computerGeneratedNumbers)
  );
}

function displayRecord() {
  let recordGuesses = localStorage.getItem("guessGameRecord") || "None";
  // Update the DOM with the record information
  document.getElementById(
    "record-guesses"
  ).textContent = `Personal Record: ${recordGuesses} guesses`;
}

function displayComputerGeneratedNumbers() {
  // Load the array from local storage. If empty it initializes an empty array
  computerGeneratedNumbers =
    JSON.parse(localStorage.getItem("computerGeneratedNumbers")) || [];

  // Clear the existing badges
  historyComputerNumbers.innerHTML = "";

  // Create and append badge elements for each number
  computerGeneratedNumbers.forEach((number) => {
    const badge = document.createElement("span");
    badge.textContent = number;
    badge.classList.add("badge", "bg-primary", "rounded-pill", "me-1");
    historyComputerNumbers.appendChild(badge);
  });
}

function resetGame() {
  if (currentGuessCount > 0 && !confirm("Do you want to start a new game?")) {
    return; // User chose not to reset the game
  }

  // Reset game variables
  computerGuessedNumber = randomNumber(minValueNumber, maxValueNumber);
  guessedNumbers = [];
  currentGuessCount = 0;

  // Reset the display for number of guesses and guessed numbers
  numberOfGuessesElement.textContent = "0";
  guessedNumbersElement.textContent = "None";

  // Reset the message for the initial content
  updateMessageAlert(initialMessage, "alert-primary");

  // Enable the guess input and guess button
  userInput.disabled = false;
  guessButton.disabled = false;

  // load the computer guessed numbers
  displayComputerGeneratedNumbers();
}

// Clear input function
function clearInput(input) {
  input.value = "";
}

// Reset message alert style function
function resetMessageAlert() {
  messageAlert.className = "alert w-50 mx-auto";
  messageAlert.classList.remove(
    "alert-danger",
    "alert-warning",
    "alert-success"
  );
}

// Update message alert with text and class
function updateMessageAlert(text, alertClass) {
  resetMessageAlert();
  messageAlert.textContent = text;
  if (alertClass) {
    messageAlert.classList.add(alertClass);
  }
}

// Event listeners for the buttons
guessButton.addEventListener("click", checkGuess);
newGameButton.addEventListener("click", resetGame);

// Load current record and computer guessed numbers
document.addEventListener("DOMContentLoaded", function () {
  displayRecord();
  displayComputerGeneratedNumbers();
});
