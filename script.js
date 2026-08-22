// ========================================
// NAVIGATION
// ========================================

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".bottom-item");

let currentScreen = "homeScreen";

// ========================================
// ANSWER TIME TRACKING
// ========================================

let questionStartTime = null;
let totalAnswerTime = 0;
let answeredQuestions = 0;

function resetAnswerTracking() {
    questionStartTime = null;
    totalAnswerTime = 0;
    answeredQuestions = 0;
}

function startAnswerTracking() {
    questionStartTime = Date.now();
}

function recordAnswerTime() {
    if (questionStartTime === null) return;

    const answerTime =
        (Date.now() - questionStartTime) / 1000;

    totalAnswerTime += answerTime;
    answeredQuestions++;

    questionStartTime = null;
}

function getAverageAnswerTime() {
    if (answeredQuestions === 0) return "0.00";

    return (
        totalAnswerTime / answeredQuestions
    ).toFixed(2);
}


function showScreen(id, addToHistory = true) {

    const targetScreen = document.getElementById(id);

    if (!targetScreen) return;


    screens.forEach(screen => {
        screen.classList.remove("active");
    });


    targetScreen.classList.add("active");

    currentScreen = id;


    navButtons.forEach(button => {

        button.classList.toggle(
            "active-nav",
            button.dataset.nav === id
        );
    });


    if (addToHistory) {

        const currentState =
            history.state?.screen;


        if (currentState !== id) {

            history.pushState(
                { screen: id },
                "",
                "#" + id
            );
        }

    }


    window.scrollTo(0, 0);

}


// Initial history state

history.replaceState(
    { screen: "homeScreen" },
    "",
    "#homeScreen"
);


// Browser / phone back gesture

window.addEventListener("popstate", event => {

    const screenId =
        event.state?.screen || "homeScreen";

    showScreen(screenId, false);

});


// Bottom navigation

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showScreen(button.dataset.nav);

    });

});


// Standard back buttons

document.querySelectorAll(".back-btn[data-back]")
    .forEach(button => {

        button.addEventListener("click", () => {

            showScreen(button.dataset.back);

        });

    });


// Home buttons

document.getElementById("goPractice")
    .onclick = () => showScreen("modeScreen");


document.getElementById("goLearn")
    .onclick = () => showScreen("learnScreen");


document.getElementById("quickPlay")
    .onclick = () => showScreen("modeScreen");


// ========================================
// USER STATS
// ========================================

let totalXP = 0;
let level = 1;
let bestScore = 0;
let streak = 0;


function updateStats() {

    level = Math.floor(totalXP / 100) + 1;

    const currentXP = totalXP % 100;


    document.getElementById("totalXP").textContent =
        totalXP;

    document.getElementById("bestScore").textContent =
        bestScore;

    document.getElementById("streakDisplay").textContent =
        streak;

    document.getElementById("levelNumber").textContent =
        level;

    document.getElementById("xpText").textContent =
        `${currentXP} / 100`;

    document.getElementById("xpFill").style.width =
        `${currentXP}%`;

}


// ========================================
// HELPER
// ========================================

const circumference = 264;


function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


// ========================================
// CALCULATION MODE
// ========================================

let selectedMode = "addition";
let selectedTime = 7;

const totalQuestions = 10;

let questionIndex = 0;
let correct = 0;
let wrong = 0;
let combo = 0;

let correctAnswer = 0;
let typedAnswer = "";

let timer = null;
let timeLeft = 0;

let answerLocked = false;


const modeButtons =
    document.querySelectorAll(".game-mode");


modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {

            btn.classList.remove("active-mode");

            btn.querySelector(".mode-select")
                .textContent = "";

        });


        button.classList.add("active-mode");

        button.querySelector(".mode-select")
            .textContent = "✓";


        selectedMode = button.dataset.mode;

    });

});


// Time selection

document.querySelectorAll(".time-buttons button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".time-buttons button")
                .forEach(btn => {

                    btn.classList.remove("selected-time");

                });


            button.classList.add("selected-time");


            selectedTime =
                Number(button.dataset.time);


            document.getElementById("timeDisplay")
                .textContent =
                `${selectedTime} SEC`;

        });

    });


// ========================================
// CALCULATION GAME
// ========================================

function getOperation() {

    const maps = {

        addition: ["+"],

        subtraction: ["-"],

        multiplication: ["*"],

        division: ["/"],

        mixedBasic: ["+", "-"],

        mixedIntermediate: ["+", "-", "*"],

        mixedAll: ["+", "-", "*", "/"]

    };


    const operations = maps[selectedMode];


    return operations[
        random(0, operations.length - 1)
    ];

}


function startGame() {

    clearInterval(timer);

    resetAnswerTracking();


    questionIndex = 0;
    correct = 0;
    wrong = 0;
    combo = 0;

    typedAnswer = "";
    answerLocked = false;


    document.getElementById("questionTotal")
        .textContent =
        totalQuestions;


    updateCombo();

    showScreen("gameScreen");

    nextQuestion();

}


document.getElementById("startGame")
    .addEventListener("click", startGame);


function nextQuestion() {

    clearInterval(timer);


    typedAnswer = "";
    answerLocked = false;


    document.getElementById("answerText")
        .textContent = "?";

    document.getElementById("feedbackMessage")
        .textContent = "";


    document.getElementById("questionNumber")
        .textContent =
        String(questionIndex + 1)
            .padStart(2, "0");


    generateQuestion();

    startAnswerTracking();

    startTimer();

}


function generateQuestion() {

    const operation = getOperation();

    let a;
    let b;
    let symbol;


    if (operation === "+") {

        a = random(1, 20);
        b = random(1, 20);

        correctAnswer = a + b;

        symbol = "+";

    }


    else if (operation === "-") {

        a = random(5, 30);
        b = random(1, a);

        correctAnswer = a - b;

        symbol = "−";

    }


    else if (operation === "*") {

        a = random(1, 20);
        b = random(1, 20);

        correctAnswer = a * b;

        symbol = "×";

    }


    else {

        b = random(1, 12);

        correctAnswer =
            random(1, 12);

        a = b * correctAnswer;

        symbol = "÷";

    }


    document.getElementById("questionText")
        .textContent =
        `${a} ${symbol} ${b}`;

}


function startTimer() {

    clearInterval(timer);

    timeLeft = selectedTime;

    updateTimerUI();


    timer = setInterval(() => {

        timeLeft--;

        updateTimerUI();


        if (timeLeft <= 0) {

            clearInterval(timer);

            handleAnswer(true);

        }

    }, 1000);

}


function updateTimerUI() {

    document.getElementById("timerText")
        .textContent =
        Math.max(0, timeLeft);


    const offset =
        circumference -
        (Math.max(0, timeLeft) / selectedTime)
        * circumference;


    document.getElementById("timerCircle")
        .style.strokeDashoffset =
        offset;

}


function updateCombo() {

    const comboText =
        document.getElementById("comboText");


    if (combo === 0) {

        comboText.textContent =
            "NO COMBO";

    }


    else if (combo < 3) {

        comboText.textContent =
            `🔥 ${combo} COMBO`;

    }


    else if (combo < 6) {

        comboText.textContent =
            `🔥🔥 ${combo} COMBO`;

    }


    else {

        comboText.textContent =
            `🔥🔥🔥 ${combo} UNSTOPPABLE!`;

    }

}


// ========================================
// CALCULATION INPUT
// ========================================

function addCalculationKey(key) {

    if (answerLocked) return;


    if (key === "clear") {

        typedAnswer =
            typedAnswer.slice(0, -1);

    }


    else if (key === "submit") {

        if (typedAnswer !== "") {

            handleAnswer(false);

        }

        return;

    }


    else if (typedAnswer.length < 5) {

        typedAnswer += key;

    }


    document.getElementById("answerText")
        .textContent =
        typedAnswer || "?";

}


document.querySelectorAll(
    ".calculation-keypad button[data-key]"
).forEach(button => {

    button.addEventListener("click", () => {

        addCalculationKey(button.dataset.key);

    });

});


function handleAnswer(timeout) {

    if (answerLocked) return;


    answerLocked = true;

    clearInterval(timer);


    // Count time only when user actually submits an answer.
    // Timeout questions are not included in average answer time.
    if (!timeout && typedAnswer !== "") {

        recordAnswerTime();

    }

    else {

        questionStartTime = null;

    }


    const isCorrect =
        !timeout &&
        Number(typedAnswer) === correctAnswer;


    const feedback =
        document.getElementById("feedbackMessage");


    if (isCorrect) {

        correct++;
        combo++;


        feedback.textContent =
            combo >= 3
                ? `PERFECT! +${10 + combo * 2} XP ⚡`
                : "CORRECT! ⚡";


        feedback.style.color =
            "#35e59a";

    }


    else {

        wrong++;
        combo = 0;


        feedback.textContent =
            timeout
                ? `TIME UP! ${correctAnswer}`
                : `ANSWER: ${correctAnswer}`;


        feedback.style.color =
            "#ff4d8d";

    }


    updateCombo();


    setTimeout(() => {

        questionIndex++;


        if (questionIndex >= totalQuestions) {

            finishCalculationGame();

        }

        else {

            nextQuestion();

        }

    }, 900);

}


function finishCalculationGame() {

    clearInterval(timer);

    questionStartTime = null;


    const score =
        correct * 100 +
        Math.max(0, correct - wrong) * 10;


    const accuracy =
        Math.round(
            (correct / totalQuestions) * 100
        );


    const earned =
        correct * 10 +
        Math.floor(accuracy / 10) * 5;


    totalXP += earned;


    if (score > bestScore) {

        bestScore = score;

    }


    if (correct >= 7) {

        streak++;

    }


    updateStats();


    showResult(
        score,
        correct,
        wrong,
        accuracy,
        earned,
        "calculation"
    );

}


// Quit calculation

document.getElementById("quitGame")
    .addEventListener("click", () => {

        clearInterval(timer);

        questionStartTime = null;

        showScreen("modeScreen");

    });


// ========================================
// LEARN SECTION
// ========================================

let learnType = "";
let learnNumber = null;

let previewMode = "learn";

let learnQuestionIndex = 0;
let learnCorrect = 0;
let learnWrong = 0;

let learnTotalQuestions = 10;

let learnAnswer = "";
let learnCorrectAnswer = 0;

let learnTimeLeft = 10;
let learnTimer = null;

let learnLocked = false;


// Learn menu

document.querySelectorAll("[data-learn]")
    .forEach(button => {

        button.addEventListener("click", () => {

            learnType =
                button.dataset.learn;


            // TABLES:
            // User selects one table first

            if (learnType === "table") {

                document.getElementById("learnTypeLabel")
                    .textContent =
                    "TABLE TRAINING";

                document.getElementById("learnSelectTitle")
                    .textContent =
                    "PICK A TABLE";


                createLearnGrid();

                showScreen("learnSelectScreen");

                return;

            }


            // SQUARES AND CUBES:
            // Directly show all values

            previewMode = "learn";

            showAllValuesPreview();

        });

    });


// Table number grid

function createLearnGrid() {

    const grid =
        document.getElementById("numberLevelGrid");


    grid.innerHTML = "";


    for (let i = 1; i <= 20; i++) {

        const button =
            document.createElement("button");


        button.textContent = i;


        button.addEventListener("click", () => {

            learnNumber = i;

            previewMode = "learn";

            showLearningPreview();

        });


        grid.appendChild(button);

    }

}


// Back to learn home

document.getElementById("backToLearn")
    .onclick = () => {

        showScreen("learnScreen");

    };


// Random table

document.getElementById("randomLearn")
    .onclick = () => {

        learnNumber = random(1, 20);

        previewMode = "learn";

        showLearningPreview();

    };


// ========================================
// TABLE PREVIEW
// ========================================

function showLearningPreview() {

    const previewLabel =
        document.getElementById("previewLabel");

    const previewTitle =
        document.getElementById("previewTitle");

    const learningContent =
        document.getElementById("learningContent");

    const practiceButton =
        document.getElementById("startPreviewPractice");


    previewMode = "learn";


    previewLabel.textContent =
        "LEARN THE TABLE";


    previewTitle.textContent =
        `TABLE OF ${learnNumber}`;


    practiceButton.textContent =
        "PRACTICE THIS TABLE ⚡";

    practiceButton.style.display =
        "block";


    learningContent.innerHTML = "";


    const tablePreview =
        document.createElement("div");


    tablePreview.className =
        "table-preview";


    for (let i = 1; i <= 10; i++) {

        const row =
            document.createElement("div");


        row.className =
            "table-row";


        row.innerHTML = `

            <span>${learnNumber} × ${i}</span>

            <span>=</span>

            <span class="table-answer">
                ${learnNumber * i}
            </span>

        `;


        tablePreview.appendChild(row);

    }


    learningContent.appendChild(tablePreview);


    showScreen("learningPreviewScreen");

}


// ========================================
// ALL SQUARES / CUBES PREVIEW
// ========================================

function showAllValuesPreview() {

    const previewLabel =
        document.getElementById("previewLabel");

    const previewTitle =
        document.getElementById("previewTitle");

    const learningContent =
        document.getElementById("learningContent");

    const practiceButton =
        document.getElementById("startPreviewPractice");


    previewMode = "learn";

    practiceButton.style.display =
        "block";


    learningContent.innerHTML = "";


    if (learnType === "square") {

        previewLabel.textContent =
            "LEARN THE SQUARES";

        previewTitle.textContent =
            "SQUARES 1–20";

        practiceButton.textContent =
            "PRACTICE SQUARES ⚡";

    }


    else {

        previewLabel.textContent =
            "LEARN THE CUBES";

        previewTitle.textContent =
            "CUBES 1–20";

        practiceButton.textContent =
            "PRACTICE CUBES ⚡";

    }


    const valuesGrid =
        document.createElement("div");


    valuesGrid.className =
        "all-values-grid";


    const power =
        learnType === "square"
            ? "²"
            : "³";


    for (let i = 1; i <= 20; i++) {

        const value =
            learnType === "square"
                ? i * i
                : i * i * i;


        const card =
            document.createElement("div");


        card.className =
            "all-value-card";


        card.innerHTML = `

            <span class="value-expression">
                ${i}${power}
            </span>

            <span class="value-equals">
                =
            </span>

            <strong class="value-answer">
                ${value}
            </strong>

        `;


        valuesGrid.appendChild(card);

    }


    learningContent.appendChild(valuesGrid);


    const challengeBox =
        document.createElement("div");


    challengeBox.className =
        "random-challenge-box";


    challengeBox.innerHTML = `

        <span>🎲</span>

        <div>

            <strong>RANDOM CHALLENGE</strong>

            <p>
                Ready to test your memory?
                Questions will appear randomly from 1 to 20.
            </p>

        </div>

    `;


    learningContent.appendChild(challengeBox);


    showScreen("learningPreviewScreen");

}


// ========================================
// PREVIEW BACK BUTTON
// ========================================

document.getElementById("backToNumberSelect")
    .onclick = () => {

        if (learnType === "table") {

            showScreen("learnSelectScreen");

        }

        else {

            showScreen("learnScreen");

        }

    };


// ========================================
// PRACTICE BUTTON
// ========================================

document.getElementById("startPreviewPractice")
    .onclick = () => {


        // Tables always use 10 questions

        if (learnType === "table") {

            learnTotalQuestions = 10;

            startLearnGame();

            return;

        }


        // Squares and Cubes choose 10 / 20

        showQuestionCountChoice();

    };


// ========================================
// QUESTION COUNT CHOICE
// ========================================

function showQuestionCountChoice() {

    previewMode = "questionChoice";


    const previewLabel =
        document.getElementById("previewLabel");

    const previewTitle =
        document.getElementById("previewTitle");

    const learningContent =
        document.getElementById("learningContent");

    const practiceButton =
        document.getElementById("startPreviewPractice");


    previewLabel.textContent =
        "RANDOM CHALLENGE";


    previewTitle.textContent =
        "CHOOSE YOUR ROUND";


    practiceButton.style.display =
        "none";


    learningContent.innerHTML = `

        <div class="question-choice-box">

            <p class="question-choice-text">
                How many questions do you want?
            </p>


            <button
                class="question-choice-btn"
                data-question-count="10">

                <span>⚡</span>

                <div>

                    <strong>10 QUESTIONS</strong>

                    <small>Quick challenge</small>

                </div>

            </button>


            <button
                class="question-choice-btn"
                data-question-count="20">

                <span>🔥</span>

                <div>

                    <strong>20 QUESTIONS</strong>

                    <small>Full memory test</small>

                </div>

            </button>

        </div>

    `;


    document
        .querySelectorAll("[data-question-count]")
        .forEach(button => {

            button.addEventListener("click", () => {

                learnTotalQuestions =
                    Number(
                        button.dataset.questionCount
                    );


                practiceButton.style.display =
                    "block";


                startLearnGame();

            });

        });


    showScreen("learningPreviewScreen");

}


// ========================================
// LEARN GAME
// ========================================

function startLearnGame() {

    clearInterval(learnTimer);

    resetAnswerTracking();


    learnQuestionIndex = 0;

    learnCorrect = 0;
    learnWrong = 0;

    learnAnswer = "";

    learnLocked = false;


    document.getElementById("learnTotalQuestions")
        .textContent =
        learnTotalQuestions;


    showScreen("learnGameScreen");

    nextLearnQuestion();

}


function nextLearnQuestion() {

    clearInterval(learnTimer);


    learnAnswer = "";

    learnLocked = false;


    document.getElementById("learnAnswerText")
        .textContent =
        "?";


    document.getElementById("learnFeedbackMessage")
        .textContent =
        "";


    document.getElementById("learnQuestionNumber")
        .textContent =
        String(learnQuestionIndex + 1)
            .padStart(2, "0");


    generateLearnQuestion();

    startAnswerTracking();

    startLearnTimer();

}


// ========================================
// GENERATE LEARN QUESTIONS
// ========================================

function generateLearnQuestion() {


    // TABLE:
    // Selected table × 1 to 10

    if (learnType === "table") {

        const multiplier =
            random(1, 10);


        learnCorrectAnswer =
            learnNumber * multiplier;


        document.getElementById("learnQuestionText")
            .textContent =
            `${learnNumber} × ${multiplier}`;


        return;

    }


    // RANDOM SQUARE

    if (learnType === "square") {

        const number =
            random(1, 20);


        learnCorrectAnswer =
            number * number;


        document.getElementById("learnQuestionText")
            .textContent =
            `${number}²`;


        return;

    }


    // RANDOM CUBE

    if (learnType === "cube") {

        const number =
            random(1, 20);


        learnCorrectAnswer =
            number * number * number;


        document.getElementById("learnQuestionText")
            .textContent =
            `${number}³`;

    }

}


// ========================================
// LEARN TIMER
// ========================================

function startLearnTimer() {

    clearInterval(learnTimer);


    learnTimeLeft = 10;

    updateLearnTimer();


    learnTimer = setInterval(() => {

        learnTimeLeft--;

        updateLearnTimer();


        if (learnTimeLeft <= 0) {

            clearInterval(learnTimer);

            handleLearnAnswer(true);

        }

    }, 1000);

}


function updateLearnTimer() {

    document.getElementById("learnTimerText")
        .textContent =
        Math.max(0, learnTimeLeft);


    const offset =
        circumference -
        (Math.max(0, learnTimeLeft) / 10)
        * circumference;


    document.getElementById("learnTimerCircle")
        .style.strokeDashoffset =
        offset;

}


// ========================================
// LEARN INPUT
// ========================================

function addLearnKey(key) {

    if (learnLocked) return;


    if (key === "clear") {

        learnAnswer =
            learnAnswer.slice(0, -1);

    }


    else if (key === "submit") {

        if (learnAnswer !== "") {

            handleLearnAnswer(false);

        }

        return;

    }


    else if (learnAnswer.length < 5) {

        learnAnswer += key;

    }


    document.getElementById("learnAnswerText")
        .textContent =
        learnAnswer || "?";

}


document.querySelectorAll(
    ".learn-keypad button[data-learn-key]"
).forEach(button => {

    button.addEventListener("click", () => {

        addLearnKey(
            button.dataset.learnKey
        );

    });

});


// ========================================
// CHECK LEARN ANSWER
// ========================================

function handleLearnAnswer(timeout) {

    if (learnLocked) return;


    learnLocked = true;

    clearInterval(learnTimer);


    // Count time only when user actually submits an answer.
    // Timeout questions are excluded from the average.
    if (!timeout && learnAnswer !== "") {

        recordAnswerTime();

    }

    else {

        questionStartTime = null;

    }


    const isCorrect =
        !timeout &&
        Number(learnAnswer) === learnCorrectAnswer;


    const feedback =
        document.getElementById(
            "learnFeedbackMessage"
        );


    if (isCorrect) {

        learnCorrect++;


        feedback.textContent =
            "MEMORISED! 🧠⚡";


        feedback.style.color =
            "#35e59a";

    }


    else {

        learnWrong++;


        feedback.textContent =
            timeout
                ? `TIME UP! ${learnCorrectAnswer}`
                : `ANSWER: ${learnCorrectAnswer}`;


        feedback.style.color =
            "#ff4d8d";

    }


    setTimeout(() => {

        learnQuestionIndex++;


        if (
            learnQuestionIndex >=
            learnTotalQuestions
        ) {

            finishLearnGame();

        }

        else {

            nextLearnQuestion();

        }

    }, 900);

}


function finishLearnGame() {

    clearInterval(learnTimer);

    questionStartTime = null;


    const accuracy =
        Math.round(
            (learnCorrect / learnTotalQuestions)
            * 100
        );


    const score =
        learnCorrect * 100;


    const earned =
        learnCorrect * 10;


    totalXP += earned;


    if (score > bestScore) {

        bestScore = score;

    }


    const requiredCorrect =
        Math.ceil(
            learnTotalQuestions * 0.7
        );


    if (learnCorrect >= requiredCorrect) {

        streak++;

    }


    updateStats();


    showResult(
        score,
        learnCorrect,
        learnWrong,
        accuracy,
        earned,
        "learn"
    );

}


// Quit learn game

document.getElementById("quitLearnGame")
    .onclick = () => {

        clearInterval(learnTimer);

        questionStartTime = null;


        if (learnType === "table") {

            showLearningPreview();

        }

        else {

            showAllValuesPreview();

        }

    };


// ========================================
// RESULT SCREEN
// ========================================

let lastGameType = "calculation";


function showResult(
    score,
    correctAnswers,
    wrongAnswers,
    accuracy,
    earned,
    gameType
) {

    lastGameType = gameType;


    document.getElementById("finalScore")
        .textContent =
        score;


    document.getElementById("finalCorrect")
        .textContent =
        correctAnswers;


    document.getElementById("finalWrong")
        .textContent =
        wrongAnswers;


    document.getElementById("finalAccuracy")
        .textContent =
        `${accuracy}%`;


    document.getElementById("earnedXP")
        .textContent =
        earned;


    // ========================================
    // AVERAGE ANSWER TIME
    // ========================================

    const averageTimeElement =
        document.getElementById("averageAnswerTime");

    if (averageTimeElement) {

        averageTimeElement.textContent =
            `${getAverageAnswerTime()}s`;

    }


    const answeredQuestionsElement =
        document.getElementById("answeredQuestionsCount");

    if (answeredQuestionsElement) {

        answeredQuestionsElement.textContent =
            answeredQuestions;

    }


    const emoji =
        document.getElementById("resultEmoji");

    const heading =
        document.getElementById("resultHeading");

    const message =
        document.getElementById("resultMessage");


    if (accuracy === 100) {

        emoji.textContent = "🏆";

        heading.textContent = "PERFECT!";

        message.textContent =
            `Absolutely unstoppable. Average speed: ${getAverageAnswerTime()}s per answer.`;

    }


    else if (accuracy >= 70) {

        emoji.textContent = "🔥";

        heading.textContent = "ON FIRE!";

        message.textContent =
            `That was seriously fast. Average: ${getAverageAnswerTime()}s per answer.`;

    }


    else if (accuracy >= 40) {

        emoji.textContent = "⚡";

        heading.textContent =
            "KEEP RUSHING!";

        message.textContent =
            `Speed comes with practice. Average: ${getAverageAnswerTime()}s per answer.`;

    }


    else {

        emoji.textContent = "🧠";

        heading.textContent =
            "BRAIN TRAINING!";

        message.textContent =
            `Come back stronger next round. Average: ${getAverageAnswerTime()}s per answer.`;

    }


    showScreen("resultScreen");

}


// Play again

document.getElementById("playAgain")
    .addEventListener("click", () => {

        if (lastGameType === "learn") {

            startLearnGame();

        }

        else {

            startGame();

        }

    });


// Back home

document.getElementById("goResultHome")
    .addEventListener("click", () => {

        showScreen("homeScreen");

    });


// ========================================
// LAPTOP KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", event => {


    // Calculation game

    if (
        document
            .getElementById("gameScreen")
            .classList
            .contains("active")
    ) {

        if (/^[0-9]$/.test(event.key)) {

            event.preventDefault();

            addCalculationKey(event.key);

        }


        else if (event.key === "Backspace") {

            event.preventDefault();

            addCalculationKey("clear");

        }


        else if (event.key === "Enter") {

            event.preventDefault();

            addCalculationKey("submit");

        }


        return;

    }


    // Learn game

    if (
        document
            .getElementById("learnGameScreen")
            .classList
            .contains("active")
    ) {

        if (/^[0-9]$/.test(event.key)) {

            event.preventDefault();

            addLearnKey(event.key);

        }


        else if (event.key === "Backspace") {

            event.preventDefault();

            addLearnKey("clear");

        }


        else if (event.key === "Enter") {

            event.preventDefault();

            addLearnKey("submit");

        }

    }

});


// ========================================
// INITIALIZE
// ========================================

updateStats();