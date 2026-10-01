let usedWords = new Set();
let lastChar = null;
let score = 0;
let timer = null;
const TIME_LIMIT = 10;
let timeLeft = TIME_LIMIT; 

async function validateAndAdd(word) {
    word = word.toLowerCase().trim();
    
    // 1. Check if the word has already been used (Soft Error)
    if (usedWords.has(word)) {
        return { valid: false, message: "⚠️ You have already used that word!" };
    }
    
    // 2. Check if it matches the required starting letter (Soft Error)
    if (lastChar !== null && word.charAt(0) !== lastChar) {
        return { valid: false, message: `⚠️ Incorrect starting letter!` };
    }

    // 3. Check if it's a real word using the Datamuse API (Soft Error)
    try {
        const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
        const data = await response.json();
        
        const isReal = data.length > 0 && data[0].word.toLowerCase() === word;
        if (!isReal) {
            return { valid: false, message: "⚠️ Not a real word!" };
        }
    } catch (error) {
        return { valid: false, message: "⚠️ Network error verifying word." };
    }

    // Update state for valid word
    usedWords.add(word);
    lastChar = word.charAt(word.length - 1);
    return { valid: true, nextChar: lastChar };
}

// Resets timer fully to 10s (used when a word is successfully guessed)
function resetTimer() {
    if(timer !== null){
        clearInterval(timer);
        timer = null;
    }
    timeLeft = 10;
    document.getElementById("timer").innerText = "TIME LEFT: 10s";

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "TIME LEFT: " + timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver("Time's up!");
        }
    }, 1000);
}

// Resumes timer from the current timeLeft without resetting it (used on errors)
function resumeTimer() {
    if(timer !== null){
        clearInterval(timer);
        timer = null;
    }
    document.getElementById("timer").innerText = "TIME LEFT: " + timeLeft + "s";

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "TIME LEFT: " + timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver("Time's up!");
        }
    }, 1000);
}

async function handleInput() {
    let inputField = document.getElementById("wordInput");
    let input = inputField.value; 
    let msgBox = document.getElementById("message");

    if(input.trim() === "") return;

    // Pause timer while validating
    clearInterval(timer);
    timer = null;

    let result = await validateAndAdd(input);
    
    if (result.valid) {
        score++;
        document.getElementById("scoreDisplay").innerText = "Score: " + score;
        inputField.value = ""; 
        inputField.focus(); 
        msgBox.innerHTML = "Next word must start with: <span id='nextLetterDisplay' style='font-weight: bold;'>" + result.nextChar.toUpperCase() + "</span>";
        resetTimer(); // Resets to 10s because they succeeded!
    } else {
        // SOFT ERROR: Show warning, keep current timeLeft, and resume the countdown!
        let letterHint = lastChar ? ` Next word must start with: <span style='font-weight: bold;'>${lastChar.toUpperCase()}</span>` : "";
        msgBox.innerHTML = `${result.message}${letterHint}`;
        
        inputField.value = "";
        inputField.focus();
        resumeTimer(); // Keeps ticking from where it left off!
    }
}

// Handles form submission via Enter key or Submit button click
function handleFormSubmit(event) {
    event.preventDefault(); 
    handleInput();
}

function gameOver(reasonText) {
    clearInterval(timer);
    timer = null;

    // Hide game screen and home screen, show dedicated Game Over screen
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("homeScreen").style.display = "none";
    
    let gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) {
        gameOverScreen.style.display = "block";
        document.getElementById("gameOverReason").innerText = reasonText;
        document.getElementById("finalScoreDisplay").innerText = score;
    }

    document.getElementById("wordInput").value = ""; 
}

function startGame() {
    if (timer !== null){
        clearInterval(timer);
        timer = null;
    }

    score = 0;
    usedWords.clear();
    lastChar = null;
    document.getElementById("scoreDisplay").innerText = "Score: 0";
    document.getElementById("message").innerText = "Game started! Type any valid word to begin.";

    // Hide home and game-over screens, show game screen
    document.getElementById("homeScreen").style.display = "none";
    
    let gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) {
        gameOverScreen.style.display = "none";
    }

    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("wordInput").focus();

    resetTimer(); 
}

function resetGame() {
    score = 0;
    usedWords.clear();
    lastChar = null;
    document.getElementById("scoreDisplay").innerText = "Score: 0";
    document.getElementById("homeScreen").style.display = "block";
    document.getElementById("gameScreen").style.display = "none";
    
    let gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) {
        gameOverScreen.style.display = "none";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleInput();
    }
}