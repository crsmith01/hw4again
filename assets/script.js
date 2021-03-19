//* Questions
const questions = [
    {
        question: "Commonly used data types DO NOT include:",
        answers: [
            {text: "Alerts", correct: true},
            {text: "Strings", correct: false},
            {text: "Numbers", correct: false},
            {text: "Booleans", correct: false}
        ],
    },
    {
        question: "The condition in an if / else statement is enclosed within:",
        answers: [
            {text: "Quotation marks", correct: true},
            {text: "Curly brackets", correct: false},
            {text: "Parentheses", correct: false},
            {text: "Square brackets", correct: false}
        ],
    },
    {
        question: "Arrays in JavaScript can be used to store:",
        answers: [
            {text: "All of the above", correct: true},
            {text: "Numbers and strings", correct: false},
            {text: "Other arrays", correct: false},
            {text: "Booleans", correct: false}
        ],
    },
    {
        question: "String values must be enclosed within _______ when being assigned to variables.",
        answers: [
            {text: "Quotation marks", correct: true},
            {text: "Curly brackets", correct: false},
            {text: "Commas", correct: false},
            {text: "Parentheses", correct: false}
        ],
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: [
            {text: "Console log", correct: true},
            {text: "JavaScript", correct: false},
            {text: "Terminal / bash", correct: false},
            {text: "For loops", correct: false}
        ],
    },
];


//* Global vars
// Taking the quiz
const highscoreBtn = document.getElementById("highscore-btn");
const clearBtn = document.getElementById("clear-btn");
const reloadBtn = document.getElementById("reload-btn");
const showTimer = document.getElementById("timeRemaining");
const startButton = document.getElementById("start-btn");
const questionContainerEl = document.getElementById("question-container");
const questionEl = document.getElementById("question");
const answerBtnsEl = document.getElementById("answer-btns");
const controlsEl = document.getElementById("controls");
const introEl = document.getElementById("intro");
const gameOverEl = document.getElementById("gameOverEl");
const scoreDisplay = document.getElementById("score");
let shuffledQuestions;
let currentQuestionIndex;

// Scoring/HighScore
const mostRecentScore = localStorage.getItem("mostRecentScore");
const initialsEl = document.getElementById("initials");
const highScoresEl = document.getElementById("highScoresEl");
const highScoresList = document.getElementById("highScoresList");
var storedHighScores = JSON.parse(localStorage.getItem("highScores"));
const maxHighScores = 5;
var highScores = [];
let score = 0;

// Timer
var counter = 60;
var interval;

//* Event listeners
startButton.addEventListener("click", startQuiz);
highscoreBtn.addEventListener("click", showHighScores);
clearBtn.addEventListener("click", clearHighScores);
reloadBtn.addEventListener("click", function () {
    location.reload();
});

//* Functions to play the game
// Starting the quiz and timer
function startQuiz() {
    startTimer();
    startButton.classList.add("hide");
    introEl.classList.add("hide");

    // Shuffles the order of the questions
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    //shows the question container element
    questionContainerEl.classList.remove("hide");

    // Displays first question
    setNextQuestion();
}

// Clears the answer boxes and shows the next question
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Shows the questions and answers in the correct elements and checks for correct answer
function showQuestion(question) {
    // Shows the question value based on the question key within the currently indexed question
    questionEl.innerText = question.question;

    // Create buttons for each answer
    question.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");

        // Checks to see which answer is correct
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerBtnsEl.appendChild(button);
    });
}

// Clears the answer boxes
function resetState() {
    while (answerBtnsEl.firstChild) {
        answerBtnsEl.removeChild(answerBtnsEl.firstChild);
    }
}

function correctAnswer() {
    // Add 10 to score
    score += 10;
    // Display "Correct!" and change background color of element for 1 sec
    controlsEl.innerHTML = "<h3>Correct!</h3>";
    controlsEl.style.backgroundColor = "green";

    setTimeout(function () {
        controlsEl.innerHTML = "";
        controlsEl.style.backgroundColor = "";
    }, 1000);
    cheerSound();
}

function wrongAnswer() {
    // Reduce timer by 10 seconds
    counter -= 10;
    // Display "Wrong!"  and change background color of element for 1 sec
    controlsEl.innerHTML = "<h3>Wrong!</h3>";
    controlsEl.style.backgroundColor = "red";
    setTimeout(function () {
        controlsEl.innerHTML = "";
        controlsEl.style.backgroundColor = "";
    }, 1000);
    booSound();
}

// Selecting your answer
function selectAnswer(event) {
    // Identifies which answer is selected
    const selectedButton = event.target;
    const correct = selectedButton.dataset.correct;

    // Check if answer is correct or incorrect and provides appropriate response
    if (correct) {
        // Display "Correct" for 1 sec if answer is correct
        correctAnswer();
    } else {
        wrongAnswer();
    }

    // Check to see if there are more questions.
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        // If there are more questions, set the next question
        currentQuestionIndex++;
        setNextQuestion();
    } else {
        // If there are no more questions, end the quiz
        gameOver();
    }
}

//* Timer
function startTimer() {
    interval = setInterval(function () {
        counter--;
        if (counter >= 0) {
            showTimer.innerHTML = counter;
        }
        if (counter <= 0) {
            clearInterval(interval);
            gameOver();
        }
    }, 1000);
}

//* Functions to end the game
function gameOver() {
    questionContainerEl.classList.add("hide");
    controlsEl.classList.add("hide");
    gameOverEl.classList.remove("hide");
    scoreDisplay.innerText = score;
    clearInterval(interval);
}

//* Utilized local storage to save user's information.
function showHighScores() {
    gameOverEl.classList.add("hide");
    startButton.classList.add("hide");
    questionContainerEl.classList.add("hide");
    controlsEl.classList.add("hide");
    highScoresEl.classList.remove("hide");
    introEl.classList.add("hide");
    clearInterval(interval);
    init();
    renderHighScore();
}

function init() {
    // Get stored highscores from localStorage
    // Parsing the JSON string to an object
    var storedHighScores = JSON.parse(localStorage.getItem("highScores"));

    // If todos were retrieved from localStorage, update the todos array to it
    if (storedHighScores !== null) {
        highScores = storedHighScores;
    }
}

function storeHighScore() {
    // Stringify and set "highscore" key in localStorage to todos array
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function renderHighScore() {
    // Render a new li for each High Score
    highScoresList.innerHTML = highScores
        .map((highScores) => {
            return `<li>${highScores.initials}: ${highScores.score}</li>`;
        })
        .join("");
}

function clearHighScores() {
    localStorage.clear();
    highScoresList.innerHTML = "";
}

initialsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    init();

    // Adding high score to array
    const highscore = {
        initials: initialsEl.value.trim(),
        score: score.toString(),
    };
    highScores.push(highscore);
    initialsEl.value = '';

    //ordering high scores and capping at 5
    highScores.sort((a, b) => b.score - a.score);

    highScores.splice(5);

    // Storing scores in local storage and rendering in DOM
    storeHighScore();
    renderHighScore();

    gameOverEl.classList.add("hide");
    highScoresEl.classList.remove("hide");
});