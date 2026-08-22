// ========================================
// NAVIGATION
// ========================================

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".bottom-item");

function showScreen(id, addToHistory = true) {

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(id);

    if (!targetScreen) return;

    targetScreen.classList.add("active");


    // Update bottom navigation
    navButtons.forEach(button => {

        button.classList.toggle(
            "active-nav",
            button.dataset.nav === id
        );

    });


    // Save the screen in browser history
    if (addToHistory) {

        history.pushState(
            { screen: id },
            "",
            "#" + id
        );

    }


    window.scrollTo(0, 0);
}


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showScreen(button.dataset.nav);

    });

});


document.querySelectorAll(".back-btn[data-back]")
    .forEach(button => {

        button.addEventListener("click", () => {

            showScreen(button.dataset.back);

        });

    });


document.getElementById("goPractice").onclick = () => {
    showScreen("modeScreen");
};


document.getElementById("goLearn").onclick = () => {
    showScreen("learnScreen");
};


document.getElementById("quickPlay").onclick = () => {
    showScreen("modeScreen");
};


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

    document.getElementById("totalXP").textContent = totalXP;

    document.getElementById("bestScore").textContent = bestScore;

    document.getElementById("streakDisplay").textContent = streak;

    document.getElementById("levelNumber").textContent = level;

    document.getElementById("xpText").textContent =
        `${currentXP} / 100`;

    document.getElementById("xpFill").style.width =
        `${currentXP}%`;
}


// ========================================
// CALCULATION MODE SELECTION
// ========================================

let selectedMode = "addition";
let selectedTime = 7;


const modeButtons =
    document.querySelectorAll(".game-mode");


modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {

            btn.classList.remove("active-mode");

            btn.querySelector(".mode-select").textContent = "";

        });


        button.classList.add("active-mode");

        button.querySelector(".mode-select").textContent = "✓";

        selectedMode = button.dataset.mode;

    });

});


document.querySelectorAll(".time-buttons button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".time-buttons button")
                .forEach(btn => {

                    btn.classList.remove("selected-time");

                });


            button.classList.add("selected-time");

            selectedTime = Number(button.dataset.time);

            document.getElementById("timeDisplay").textContent =
                `${selectedTime} SEC`;

        });

    });


// ========================================
// CALCULATION GAME
// ========================================

let questionIndex = 0;
const totalQuestions = 10;

let correct = 0;
let wrong = 0;
let combo = 0;

let correctAnswer = 0;
let typedAnswer = "";

let timer;
let timeLeft;

let answerLocked = false;

const circumference = 264;


function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


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

    questionIndex = 0;
    correct = 0;
    wrong = 0;
    combo = 0;

    showScreen("gameScreen");

    nextQuestion();

}


document.getElementById("startGame")
    .addEventListener("click", startGame);


function nextQuestion() {

    clearInterval(timer);

    typedAnswer = "";

    answerLocked = false;

    document.getElementById("answerText").textContent = "?";

    document.getElementById("feedbackMessage").textContent = "";

    updateQuestionNumber();

    generateQuestion();

    startTimer();

}


function updateQuestionNumber() {

    document.getElementById("questionNumber").textContent =
        String(questionIndex + 1).padStart(2, "0");

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


    if (operation === "-") {

        a = random(5, 30);
        b = random(1, a);

        correctAnswer = a - b;

        symbol = "−";

    }


    if (operation === "*") {

        a = random(1, 20);
        b = random(1, 20);

        correctAnswer = a * b;

        symbol = "×";

    }


    if (operation === "/") {

        b = random(1, 12);

        correctAnswer = random(1, 12);

        a = b * correctAnswer;

        symbol = "÷";

    }


    document.getElementById("questionText").textContent =
        `${a} ${symbol} ${b}`;

}


function startTimer() {

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

    document.getElementById("timerText").textContent =
        timeLeft;


    const offset =
        circumference -
        (timeLeft / selectedTime) * circumference;


    document.getElementById("timerCircle")
        .style.strokeDashoffset = offset;

}


function updateCombo() {

    const comboText =
        document.getElementById("comboText");


    if (combo === 0) {

        comboText.textContent = "NO COMBO";

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
// CALCULATION KEYPAD
// ========================================

document.querySelectorAll(
    ".calculation-keypad button[data-key]"
).forEach(button => {

    button.addEventListener("click", () => {

        const key = button.dataset.key;


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


        else {

            if (typedAnswer.length < 5) {

                typedAnswer += key;

            }

        }


        document.getElementById("answerText").textContent =
            typedAnswer || "?";

    });

});


// ========================================
// CHECK CALCULATION ANSWER
// ========================================

function handleAnswer(timeout) {

    if (answerLocked) return;

    answerLocked = true;

    clearInterval(timer);


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

        feedback.style.color = "#35e59a";

    }


    else {

        wrong++;
        combo = 0;

        feedback.textContent =
            timeout
                ? `TIME UP! ${correctAnswer}`
                : `ANSWER: ${correctAnswer}`;

        feedback.style.color = "#ff4d8d";

    }


    updateCombo();


    setTimeout(() => {

        questionIndex++;

        answerLocked = false;


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


document.getElementById("quitGame")
    .addEventListener("click", () => {

        clearInterval(timer);

        showScreen("modeScreen");

    });


// ========================================
// LEARN SECTION
// ========================================

let learnType = "";
let learnNumber = null;


document.querySelectorAll("[data-learn]")
    .forEach(button => {

        button.addEventListener("click", () => {

            learnType = button.dataset.learn;


            // ================================
            // TABLES KEEP THE OLD FLOW
            // ================================

            if (learnType === "table") {

                const label =
                    document.getElementById("learnTypeLabel");

                const title =
                    document.getElementById("learnSelectTitle");


                label.textContent =
                    "TABLE TRAINING";

                title.textContent =
                    "PICK A TABLE";


                createLearnGrid();

                showScreen("learnSelectScreen");

                return;
            }


            // ================================
            // SQUARES AND CUBES:
            // DIRECTLY SHOW ALL VALUES
            // ================================

            showAllValuesPreview();

        });

    });


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

            showLearningPreview();

        });


        grid.appendChild(button);

    }

}
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

            showLearningPreview();

        });


        grid.appendChild(button);

    }

}

// ========================================
// SHOW ALL SQUARES / CUBES
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


    // ================================
    // SQUARES
    // ================================

    if (learnType === "square") {

        previewLabel.textContent =
            "LEARN THE SQUARES";

        previewTitle.textContent =
            "SQUARES 1–20";

        practiceButton.textContent =
            "PRACTICE SQUARES ⚡";

    }


    // ================================
    // CUBES
    // ================================

    if (learnType === "cube") {

        previewLabel.textContent =
            "LEARN THE CUBES";

        previewTitle.textContent =
            "CUBES 1–20";

        practiceButton.textContent =
            "PRACTICE CUBES ⚡";

    }


    // Clear previous content
    learningContent.innerHTML = "";


    const valuesGrid =
        document.createElement("div");

    valuesGrid.className =
        "all-values-grid";


    // Create all values from 1 to 20
    for (let i = 1; i <= 20; i++) {

        const value =
            learnType === "square"
                ? i * i
                : i * i * i;


        const power =
            learnType === "square"
                ? "²"
                : "³";


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


    // Add random challenge message
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


document.getElementById("backToLearn")
    .onclick = () => {

        showScreen("learnScreen");

    };


// ========================================
// RANDOM LEARNING
// ========================================

document.getElementById("randomLearn")
    .onclick = () => {

        learnNumber = random(1, 20);

        showLearningPreview();

    };


// ========================================
// LEARNING PREVIEW
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


    learningContent.innerHTML = "";


    // TABLE PREVIEW

    if (learnType === "table") {

        previewLabel.textContent =
            "LEARN THE TABLE";

        previewTitle.textContent =
            `TABLE OF ${learnNumber}`;

        practiceButton.textContent =
            "PRACTICE THIS TABLE ⚡";


        const tablePreview =
            document.createElement("div");

        tablePreview.className =
            "table-preview";


        // IMPORTANT:
        // ONLY 1 TO 10

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

    }


    // SQUARE PREVIEW

    if (learnType === "square") {

        previewLabel.textContent =
            "LEARN THE SQUARE";

        previewTitle.textContent =
            `${learnNumber} SQUARED`;

        practiceButton.textContent =
            "PRACTICE SQUARES ⚡";


        learningContent.innerHTML = `

            <div class="single-value-preview">

                <div class="preview-expression">
                    ${learnNumber}²
                </div>

                <div class="preview-answer">
                    ${learnNumber * learnNumber}
                </div>

                <p class="preview-message">
                    Remember this value and test yourself.
                </p>

            </div>

        `;

    }


    // CUBE PREVIEW

    if (learnType === "cube") {

        previewLabel.textContent =
            "LEARN THE CUBE";

        previewTitle.textContent =
            `${learnNumber} CUBED`;

        practiceButton.textContent =
            "PRACTICE CUBES ⚡";


        learningContent.innerHTML = `

            <div class="single-value-preview">

                <div class="preview-expression">
                    ${learnNumber}³
                </div>

                <div class="preview-answer">
                    ${learnNumber * learnNumber * learnNumber}
                </div>

                <p class="preview-message">
                    Remember this value and test yourself.
                </p>

            </div>

        `;

    }


    showScreen("learningPreviewScreen");

}


// BACK FROM PREVIEW

document.getElementById("backToNumberSelect")
    .onclick = () => {

        showScreen("learnSelectScreen");

    };


// START PRACTICE FROM PREVIEW

document.getElementById("startPreviewPractice")
    .onclick = () => {

        // Tables keep 10 questions
        if (learnType === "table") {

            learnTotalQuestions = 10;

            startLearnGame();

            return;

        }


        // Squares and Cubes:
        // Ask how many questions the user wants
        showQuestionCountChoice();

    };

    // ========================================
// CHOOSE QUESTION COUNT
// ========================================

function showQuestionCountChoice() {

    const learningContent =
        document.getElementById("learningContent");

    const previewLabel =
        document.getElementById("previewLabel");

    const previewTitle =
        document.getElementById("previewTitle");


    previewLabel.textContent =
        "RANDOM CHALLENGE";

    previewTitle.textContent =
        "CHOOSE YOUR ROUND";


    learningContent.innerHTML = `

        <div class="question-choice-box">

            <p class="question-choice-text">
                How many questions do you want?
            </p>


            <button
                class="question-choice-btn"
                data-question-count="10"
            >
                <span>⚡</span>

                <div>
                    <strong>10 QUESTIONS</strong>
                    <small>Quick challenge</small>
                </div>
            </button>


            <button
                class="question-choice-btn"
                data-question-count="20"
            >
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


                startLearnGame();

            });

        });


    showScreen("learningPreviewScreen");

}


// ========================================
// LEARN PRACTICE GAME
// ========================================

let learnQuestionIndex = 0;
let learnCorrect = 0;
let learnWrong = 0;

let learnTotalQuestions = 10;

let learnAnswer = "";
let learnCorrectAnswer = 0;

let learnTimeLeft = 10;
let learnTimer;

let learnLocked = false;


function startLearnGame() {

    learnQuestionIndex = 0;

    learnCorrect = 0;
    learnWrong = 0;

    learnLocked = false;


    document.getElementById("learnTotalQuestions")
        .textContent = learnTotalQuestions;


    showScreen("learnGameScreen");

    nextLearnQuestion();

}


function nextLearnQuestion() {

    clearInterval(learnTimer);

    learnAnswer = "";

    learnLocked = false;


    document.getElementById("learnAnswerText")
        .textContent = "?";


    document.getElementById("learnFeedbackMessage")
        .textContent = "";


    document.getElementById("learnQuestionNumber")
        .textContent =
        String(learnQuestionIndex + 1)
            .padStart(2, "0");


    generateLearnQuestion();

    startLearnTimer();

}


// ========================================
// GENERATE LEARN QUESTIONS
// ========================================

function generateLearnQuestion() {


    // ================================
    // TABLES
    // Selected table × 1 to 10
    // ================================

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


    // ================================
    // RANDOM SQUARE
    // ================================

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


    // ================================
    // RANDOM CUBE
    // ================================

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
        learnTimeLeft;


    const offset =
        circumference -
        (learnTimeLeft / 10) * circumference;


    document.getElementById("learnTimerCircle")
        .style.strokeDashoffset =
        offset;

}


// ========================================
// LEARN KEYPAD
// ========================================

document.querySelectorAll(
    ".learn-keypad button[data-learn-key]"
).forEach(button => {

    button.addEventListener("click", () => {

        const key =
            button.dataset.learnKey;


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


        else {

            if (learnAnswer.length < 5) {

                learnAnswer += key;

            }

        }


        document.getElementById("learnAnswerText")
            .textContent =
            learnAnswer || "?";

    });

});


// ========================================
// CHECK LEARN ANSWER
// ========================================

function handleLearnAnswer(timeout) {

    if (learnLocked) return;

    learnLocked = true;

    clearInterval(learnTimer);


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

        learnLocked = false;


        if (learnQuestionIndex >= learnTotalQuestions) {

            finishLearnGame();

        }

        else {

            nextLearnQuestion();

        }

    }, 900);

}


function finishLearnGame() {

    clearInterval(learnTimer);


    const accuracy =
        Math.round(
            (learnCorrect / 10) * 100
        );


    const score =
        learnCorrect * 100;


    const earned =
        learnCorrect * 10;


    totalXP += earned;


    if (score > bestScore) {

        bestScore = score;

    }


    if (learnCorrect >= 7) {

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


// QUIT LEARN PRACTICE

document.getElementById("quitLearnGame")
    .onclick = () => {

        clearInterval(learnTimer);

        showLearningPreview();

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
        .textContent = score;


    document.getElementById("finalCorrect")
        .textContent = correctAnswers;


    document.getElementById("finalWrong")
        .textContent = wrongAnswers;


    document.getElementById("finalAccuracy")
        .textContent = `${accuracy}%`;


    document.getElementById("earnedXP")
        .textContent = earned;


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
            "Absolutely unstoppable.";

    }


    else if (accuracy >= 70) {

        emoji.textContent = "🔥";

        heading.textContent = "ON FIRE!";

        message.textContent =
            "That was seriously fast.";

    }


    else if (accuracy >= 40) {

        emoji.textContent = "⚡";

        heading.textContent = "KEEP RUSHING!";

        message.textContent =
            "Speed comes with practice.";

    }


    else {

        emoji.textContent = "🧠";

        heading.textContent =
            "BRAIN TRAINING!";

        message.textContent =
            "Come back stronger next round.";

    }


    showScreen("resultScreen");

}


// PLAY AGAIN

document.getElementById("playAgain")
    .addEventListener("click", () => {

        if (lastGameType === "learn") {

            startLearnGame();

        }

        else {

            startGame();

        }

    });


// BACK HOME

document.getElementById("goResultHome")
    .addEventListener("click", () => {

        showScreen("homeScreen");

    });


updateStats();

// ========================================
// LAPTOP / PHYSICAL KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", (event) => {

    // Don't do anything if result screen is open
    if (document.getElementById("resultScreen").classList.contains("active")) {
        return;
    }


    // ========================================
    // CALCULATION GAME KEYBOARD
    // ========================================

    if (document.getElementById("gameScreen").classList.contains("active")) {

        // Numbers 0 to 9
        if (/^[0-9]$/.test(event.key)) {

            if (typedAnswer.length < 5 && !answerLocked) {

                typedAnswer += event.key;

                document.getElementById("answerText").textContent =
                    typedAnswer;

            }

        }


        // Backspace
        else if (event.key === "Backspace") {

            if (!answerLocked) {

                typedAnswer = typedAnswer.slice(0, -1);

                document.getElementById("answerText").textContent =
                    typedAnswer || "?";

            }

        }


        // Enter = Submit
        else if (event.key === "Enter") {

            if (typedAnswer !== "" && !answerLocked) {

                handleAnswer(false);

            }

        }

    }


    // ========================================
    // TABLE / SQUARE / CUBE PRACTICE KEYBOARD
    // ========================================

    if (document.getElementById("learnGameScreen").classList.contains("active")) {

        // Numbers 0 to 9
        if (/^[0-9]$/.test(event.key)) {

            if (learnAnswer.length < 5 && !learnLocked) {

                learnAnswer += event.key;

                document.getElementById("learnAnswerText").textContent =
                    learnAnswer;

            }

        }


        // Backspace
        else if (event.key === "Backspace") {

            if (!learnLocked) {

                learnAnswer = learnAnswer.slice(0, -1);

                document.getElementById("learnAnswerText").textContent =
                    learnAnswer || "?";

            }

        }


        // Enter = Submit
        else if (event.key === "Enter") {

            if (learnAnswer !== "" && !learnLocked) {

                handleLearnAnswer(false);

            }

        }

    }

});