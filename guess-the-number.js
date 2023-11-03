// Constants for elements
const noOfGuessesElement = document.getElementById("no-of-guesses");
const guessedNumsElement = document.getElementById("guessed-nums");
const messageAlert = document.getElementById("messageAlert");
const messageSubHeader = document.getElementById("subHeader");
const historyComputerNumbers = document.getElementById("comp-nums"); //

// Start game configuration
let minValueNumber = 1;
let maxValueNumber = 5;
let computerGuessedNumber = randomNumber(minValueNumber, maxValueNumber);
let guessedNumbers = [];
let currentGuessCount = 0;
let computerGeneratedNumbers = [];
messageAlert.textContent = "Which number am I thinking?";
messageSubHeader.textContent = `Try to guess a number between ${minValueNumber} and ${maxValueNumber}.`;

// Return a random number between minimum value and the parameter max
function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function checkGuess() {
  const userGuess = parseInt(document.getElementById("guessInput").value);
  console.log(userGuess);
  console.log(computerGuessedNumber);

  clearInput(); // Use a function for clearing input
  resetMessageAlert(); // Reset message alert style

  if (!userGuess || userGuess < minValueNumber || userGuess > maxValueNumber) {
    updateMessageAlert(
      `Please enter a number between ${minValueNumber} and ${maxValueNumber}.`,
      "alert-danger"
    );
    return;
  }

  guessedNumbers.push(userGuess);
  currentGuessCount++;

  // Update the display for number of guesses
  noOfGuessesElement.textContent = currentGuessCount;

  // Update the display for guessed numbers
  guessedNumsElement.textContent = guessedNumbers.join(", ");

  if (userGuess === computerGuessedNumber) {
    updateMessageAlert(
      `Congratulations! You guessed it! - The number was ${computerGuessedNumber}`,
      "alert-success"
    );
    updateRecord(currentGuessCount);
    updateComputerChosenNumbers(computerGuessedNumber);
    document.getElementById("guessInput").disabled = true;
    document.getElementById("guessButton").disabled = true;
  } else if (userGuess < computerGuessedNumber) {
    updateMessageAlert("Too low!", "alert-warning");
  } else {
    updateMessageAlert("Too high!", "alert-warning");
  }
}

// Function to check if the current win beats the record, and update the record accordingly
function updateRecord(guessCount) {
  // Retrieve the record from local storage, or set it to a high number by default
  let recordGuesses =
    parseInt(localStorage.getItem("guessGameRecord")) || Infinity;

  // Check if the current guess count is less than the record guess count
  if (guessCount < recordGuesses) {
    // Save the new record to local storage
    localStorage.setItem("guessGameRecord", guessCount.toString());
    displayRecord(); // Call a function to update the record display on the page
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
  ).textContent = `Record: ${recordGuesses} guesses`;
}

function displayComputerGeneratedNumbers() {
  // Load the array from local storage or initialize it as an empty array
  computerGeneratedNumbers =
    JSON.parse(localStorage.getItem("computerGeneratedNumbers")) || [];

  // Clear the existing badges
  historyComputerNumbers.innerHTML = "";

  // Create and append badge elements to the `historyComputerNumbers` container for each number
  computerGeneratedNumbers.forEach((number) => {
    const badge = document.createElement("span");
    badge.textContent = number;
    badge.classList.add("badge", "bg-primary", "rounded-pill", "me-1"); // "me-1" for margin-right if using Bootstrap 5
    historyComputerNumbers.appendChild(badge);
  });

  //historyComputerNumbers.textContent = computerGeneratedNumbers.join(", ");

  /*
  const list = document.getElementById("computerNumbersList");
  list.innerHTML = ""; // Clear the current list

  // Create and append list items to the list for each number
  computerGeneratedNumbers.forEach((number) => {
    const listItem = document.createElement("li");
    listItem.textContent = number;
    listItem.classList.add("list-group-item", "text-center");
    list.appendChild(listItem);
  });
  */
}

function resetGame() {
  if (
    currentGuessCount > 0 &&
    !confirm("Are you sure you want to start a new game?")
  ) {
    return; // User chose not to reset the game
  }

  // Reset game variables
  computerGuessedNumber = randomNumber(minValueNumber, maxValueNumber);
  guessedNumbers = [];
  currentGuessCount = 0;

  // Reset the display for number of guesses and guessed numbers
  document.getElementById("no-of-guesses").textContent = "0";
  document.getElementById("guessed-nums").textContent = "None";

  // Clear any existing hint messages
  messageAlert.className = "alert w-50 mx-auto alert-primary";
  messageAlert.textContent = "Which number am I thinking?";

  // Enable the guess input in case it was disabled
  document.getElementById("guessInput").disabled = false;
  document.getElementById("guessButton").disabled = false;

  // Clear the guess input
  document.getElementById("guessInput").value = "";

  displayComputerGeneratedNumbers();
}

// !!!NEED BETTER DESCRIPTION Clear input function
function clearInput() {
  document.getElementById("guessInput").value = "";
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
  messageAlert.textContent = text;
  if (alertClass) {
    messageAlert.classList.add(alertClass);
  }
}

// Add event listener for the "New Game" button
document.getElementById("newGameButton").addEventListener("click", resetGame);
document.getElementById("guessButton").addEventListener("click", checkGuess);

// Call this function when the page loads to display the current record
document.addEventListener("DOMContentLoaded", function () {
  displayRecord();
  displayComputerGeneratedNumbers(); // Load the numbers when the page is loaded
});
