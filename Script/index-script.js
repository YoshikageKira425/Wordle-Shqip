const row = Array.from(document.getElementsByClassName("row"));
let correctWord = "";
let description = "";

let rowIndex = 0;
let lettersIndex = 0;
let word = "";
let gameFinished = false;

const keyboard = document.querySelectorAll("#key");
const enterKeyboard = document.getElementById("Enter");
const delKeyboard = document.getElementById("Del");
const overlay = document.getElementById("overlay");

startGame();

function startGame() {
    // Reset game state
    rowIndex = 0;
    lettersIndex = 0;
    word = "";
    gameFinished = false;

    // Clear UI elements
    row.forEach(r => r.innerHTML = "");
    keyboard.forEach(k => k.style.backgroundColor = "#08315e");
    overlay.innerHTML = "";

    // Fetch random word data
    fetch('Script/date.json')
        .then(res => res.json())
        .then(data => {
            const { word: fetchedWord, description: desc, letters } = data[Math.floor(Math.random() * data.length)];
            correctWord = fetchedWord;
            description = desc;
            document.getElementById("description").textContent = "Kuptimi: " + description;

            // Create game board slots
            row.forEach(r => {
                for (let i = 0; i < letters; i++) {
                    const span = document.createElement('span');
                    span.className = 'slot';
                    r.appendChild(span);
                }
            });
        });
}

//Keyboard events
document.addEventListener("keydown", (e) => {
    if (gameFinished) return;

    if (e.key === "Backspace" && lettersIndex > 0) {
        removeKey();
        return;
    }
    if (e.key === "Enter" && word.length === correctWord.length)
    {
        enterKey();
        return;
    }

    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key) && rowIndex < row.length && lettersIndex < row[rowIndex].childNodes.length) {
        anyKey(key);
    }
});

function enterKey() {
    animateKey(enterKeyboard, 'letter-typed');

    row[rowIndex].childNodes.forEach((cell, i) => {
        setTimeout(() => {
            cell.classList.add("tile-flip");
            setTimeout(() => {
                cell.classList.remove("tile-flip");

                const letter = word[i];
                const correct = correctWord[i];

                let color = "red";
                if (letter === correct) color = "green";
                else if (correctWord.includes(letter)) color = "#b5a836";

                cell.style.backgroundColor = color;
                cell.style.borderColor = color;
            }, 600);
        }, i * 300);
    });

    setTimeout(() => {
        updateKeyboardColors();

        setTimeout(() => {
            if (word === correctWord) win();
            else if (rowIndex === row.length - 1) gameOver();

            word = "";
            lettersIndex = 0;
            rowIndex++;
        }, 300);
    }, 350 * word.length);
}

function anyKey(key) {
    const currentRow = row[rowIndex].childNodes;
    currentRow[lettersIndex].style.borderColor = "green";
    if (lettersIndex > 0) currentRow[lettersIndex - 1].style.borderColor = "#3a3a3c";

    const cell = currentRow[lettersIndex];
    const keyButton = [...keyboard].find(k => k.textContent.toLowerCase() === key);

    setTimeout(() => {
        cell.textContent = key.toUpperCase();
        animateKey(cell, 'letter-typed');
        animateKey(keyButton, 'letter-typed');
    }, 150);

    word += key;
    lettersIndex++;
}

function removeKey() {
    lettersIndex--;
    const currentRow = row[rowIndex].childNodes;

    currentRow[lettersIndex].style.borderColor = "#3a3a3c";
    if (lettersIndex > 0) currentRow[lettersIndex - 1].style.borderColor = "green";

    const cell = currentRow[lettersIndex];

    setTimeout(() => {
        cell.textContent = "";
        animateKey(cell, 'letter-remove');
        animateKey(delKeyboard, 'letter-remove');
    }, 150);

    word = word.slice(0, -1);
}

//Win and Lose functions
function win() {
    localStorage.setItem("win", Number(localStorage.getItem("win") || 0) + 1);

    overlay.innerHTML = `
        <div class="fixed inset-0 backdrop-blur-md flex justify-center items-center bg-[#101828ad]" id="WinScreen">
            <div class="bg-white p-5 rounded-xl w-[60%] h-max text-center">
                <h1 class="font-bold text-3xl text-[#08315e] mb-3">🎉 Urime!</h1>
                <hr class="text-[#08315e] mb-3">
                <p class="font-bold text-xl">Fjala ishte ${correctWord}</p>
                <p>Kuptimi: ${description}</p>
                <p>Keni fituar ${localStorage.getItem("win")} dhe keni humb ${localStorage.getItem("lose") || 0}.</p>
                <button onclick="startGame()" class="bg-[#08315e] font-bold text-white w-full py-3 mt-3 rounded-lg">Luaj Serish</button>
                <button onclick='window.location.href = "home.html"' class="bg-[#08315e] font-bold text-white w-full py-3 mt-3 rounded-lg">Mbrapa</button>
            </div>
        </div>
    `;

    animatePopup();
    gameFinished = true;
}

function gameOver() {
    localStorage.setItem("lose", Number(localStorage.getItem("lose") || 0) + 1);

    overlay.innerHTML = `
        <div class="fixed inset-0 backdrop-blur-md flex justify-center items-center bg-[#101828ad]" id="LoseScreen">
            <div class="bg-white p-5 rounded-xl w-[60%] h-max text-center">
                <h1 class="font-bold text-3xl text-[#b91c1c] mb-3">❌ Humbje!</h1>
                <hr class="text-[#b91c1c] mb-3">
                <p class="font-bold text-xl">Fjala ishte ${correctWord}</p>
                <p>Kuptimi: ${description}</p>
                <p>Keni fituar ${localStorage.getItem("win") || 0} dhe keni humb ${localStorage.getItem("lose")}.</p>
                <button onclick="startGame()" class="bg-[#b91c1c] font-bold text-white w-full py-3 mt-3 rounded-lg">Luaj Përsëri</button>
                <button onclick='window.location.href = "home.html"' class="bg-[#b91c1c] font-bold text-white w-full py-3 mt-3 rounded-lg">Mbrapa</button>
            </div>
        </div>
    `;

    animatePopup();
    gameFinished = true;
}

//Effects and animations
function animateKey(element, className) {
    if (!element) return;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 300);
}

function updateKeyboardColors() {
    for (let i = 0; i < keyboard.length; i++) {
        const keyElement = keyboard[i];
        const keyChar = keyElement.textContent.toLowerCase();
    
        if (correctWord.includes(keyChar)) {
            if (correctWord.indexOf(keyChar) === word.indexOf(keyChar)) {
                keyElement.style.backgroundColor = "green";
            } else if (word.includes(keyChar)) {
                keyElement.style.backgroundColor = "#b5a836";
            }
        } else if (word.includes(keyChar)) {
            keyElement.style.backgroundColor = "red";
        }
    }
}

function animatePopup() {
    const screen = overlay.firstElementChild;
    const popup = screen.firstElementChild;

    requestAnimationFrame(() => {
        screen.classList.add("Screen");
        popup.classList.add("PopUp");

        setTimeout(() => {
            screen.classList.remove("Screen");
            popup.classList.remove("PopUp");
        }, 800);
    });
}
