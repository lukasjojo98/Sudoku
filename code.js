const ROW_COUNT = 9;
const COL_COUNT = 9;
let currentRow = 0;
let currentCol = 0;
let isEntered = false;
let interval;
let minutes = 0;
let seconds = 0;
let isAnimationDone = true;
let correctLetters = 0;
let enteredWord = "";
let wordToGuess = "";
let isWordGuessed = false;
let isNumbers = true;
let errors = 0;

function createMap(board) {
    const container = document.querySelector('.board-container');
    for(let i = 0; i < ROW_COUNT; i++){
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-item');
        rowContainer.id = `row-${i}`;
        for(let j = 0; j < COL_COUNT; j++){
            const fieldItem = document.createElement('div');
            if(i == 0){
                fieldItem.classList.add('grid-border-top');
            }
            if(i == 8){
                fieldItem.classList.add('grid-border-bottom');
            }
            if(j == 2){
                fieldItem.classList.add('submatrix-border-right');
            }
            if(j == 6){
                fieldItem.classList.add('submatrix-border-left');
            }
            if(j == 0){
                fieldItem.classList.add('grid-border-left');
            }
            if(j == 8){
                fieldItem.classList.add('grid-border-right');
            }
            if(i == 2){
                fieldItem.classList.add('submatrix-border-bottom');
            }
            if(i == 6){
                fieldItem.classList.add('submatrix-border-top');
            }
            fieldItem.id = `${i},${j}`;
            fieldItem.classList.add('field-item');
            fieldItem.classList.add('matrix-default-border');
            if(board[i][j] !== 0) {
                fieldItem.innerHTML = board[i][j];
            }
            fieldItem.addEventListener("click", () => {
                try {
                    document.querySelector('.clicked-field-item').classList.remove('clicked-field-item');
                } catch (error) {
                    console.log(error);
                }
                fieldItem.classList.add('clicked-field-item');
                [currentRow, currentCol] = fieldItem.id.split(",");
                visualizeCorresponding(fieldItem);
            });
            rowContainer.append(fieldItem);
        }
        container.append(rowContainer);
    }
}

function visualizeCorresponding(element) {
    try {
        const elements = document.querySelectorAll('.active-field-item');
        for(let k = 0; k < elements.length; k++){
            elements[k].classList.remove('active-field-item');
        }
    } catch (error) {
        console.log(error);
    }
    element.classList.add('active-field-item');
    const [row, col] = element.id.split(",");
    for(let i = 0; i < COL_COUNT; i++){
        const rowElement = document.getElementById(row + "," + i);
        rowElement.classList.add('active-field-item');
        const colElement = document.getElementById(i + "," + col);
        colElement.classList.add('active-field-item');
    }
    if(row < 3 && col < 3){
        fillQuadrant(0, 2, 0, 2);
    }
    if((row > 2 && row < 6) && (col < 3)) {
        fillQuadrant(3, 5, 0, 2);
    }
    if((row > 5 && row < 9) && (col < 3)) {
        fillQuadrant(6, 8, 0, 2);
    }
    if(row < 3 && (col > 2 && col < 6)){
        fillQuadrant(0, 2, 3, 5);
    }
    if((row > 2 && row < 6) && (col > 2 && col < 6)) {
        fillQuadrant(3, 5, 3, 5);
    }
    if((row > 5 && row < 9) && (col > 2 && col < 6)) {
        fillQuadrant(6, 8, 3, 5);
    }
    if(row < 3 && (col > 5 && col < 9)){
        fillQuadrant(0, 2, 6, 8);
    }
    if((row > 2 && row < 6) && (col > 5 && col < 9)) {
        fillQuadrant(3, 5, 6, 8);
    }
    if((row > 5 && row < 9) && (col > 5 && col < 9)) {
        fillQuadrant(6, 8, 6, 8);
    }
}

function fillQuadrant(rowMin, rowMax, colMin, colMax) {
     for(let i = rowMin; i < rowMax + 1; i++){
        for(let j = colMin; j < colMax + 1; j++){
            const rowElement = document.getElementById(i + "," + j);
            rowElement.classList.add('active-field-item');
        }
    }
}

function checkQuadrantForError(rowMin, rowMax, colMin, colMax, numberValue) {
     for(let i = rowMin; i < rowMax + 1; i++){
        for(let j = colMin; j < colMax + 1; j++){
            const rowElement = document.getElementById(i + "," + j);
            if (rowElement.innerHTML == numberValue && (i != currentRow && j != currentCol)){
                return true;
            }
        }
    }
    return false;
}

function processKeypress(key) {
    const keyUppercase = key.toUpperCase();
    const elements = firstRow.concat(secondRow, thirdRow);
    if (elements.includes(keyUppercase) || elements.includes(key)){
        console.log(key)
        if(key == "Enter"){
            if(currentCol == 4){
                isEntered = true;
                isAnimationDone = false;
            }
            animateLetterBackground();
            return;
        }
        addLetter(keyUppercase);
    }
    else {
        return;
    }
}

function checkForError() {
    const errorDisplay = document.getElementById('error-display');
    const element = document.getElementById(currentRow + "," + currentCol);
    const [row, col] = element.id.split(",");
    const value = element.innerHTML;
    for(let i = 0; i < COL_COUNT; i++){
        const rowElement = document.getElementById(row + "," + i);
        const colElement = document.getElementById(i + "," + col);
        if((rowElement.innerHTML == value && element != rowElement || colElement.innerHTML == value && colElement != element)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
     if(row < 3 && col < 3){
        if(checkQuadrantForError(0, 2, 0, 2, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if((row > 2 && row < 6) && (col < 3)) {
        if(checkQuadrantForError(3, 5, 0, 2, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if((row > 5 && row < 9) && (col < 3)) {
        if(checkQuadrantForError(6, 8, 0, 2, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if(row < 3 && (col > 2 && col < 6)){
        if(checkQuadrantForError(0, 2, 3, 5, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if((row > 2 && row < 6) && (col > 2 && col < 6)) {
        if(checkQuadrantForError(3, 5, 3, 5, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if((row > 5 && row < 9) && (col > 2 && col < 6)) {
        if(checkQuadrantForError(6, 8, 3, 5, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if(row < 3 && (col > 5 && col < 9)){
        if(checkQuadrantForError(0, 2, 6, 8, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if((row > 2 && row < 6) && (col > 5 && col < 9)) {
        if(checkQuadrantForError(3, 5, 6, 8, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
    if((row > 5 && row < 9) && (col > 5 && col < 9)) {
        if(checkQuadrantForError(6, 8, 6, 8, value)){
            errors++;
            errorDisplay.innerHTML = "Error: " + errors;
            return;
        }
    }
}

function addNumber(numberValue) {
    const element = document.getElementById(currentRow + "," + currentCol);
    element.innerHTML = numberValue;
    if(isNumbers){
        checkForError();
    }
}

async function readFromJSON() {
    fetch('boards.json')
    .then(response => response.json())
    .then(json => createMap(json["RawSudoku"][Math.floor(Math.random() * json["RawSudoku"].length)]));
}

function changeNumbersContainer() {
    const candidateElements = document.querySelectorAll('.candidate-item');
    if(!isNumbers){
        for(let i = 0; i < candidateElements.length; i++){
            candidateElements[i].classList.add('candidate-item-large');
            candidateElements[i].classList.remove('candidate-item-medium');
            candidateElements[i].innerHTML = (i + 1);
        }
        isNumbers = !isNumbers;
        return;
    } 
    else {
        for(let i = 0; i < candidateElements.length; i++){
            candidateElements[i].classList.remove('candidate-item-large');
            candidateElements[i].classList.add('candidate-item-medium');
            candidateElements[i].innerHTML = "";
            const div = document.createElement('div');
            for(let j = 0; j < 3; j++){
                const row = document.createElement('div');
                row.classList.add('candidates-row');
                for(let k = 0; k < 3; k++){
                    const rowItem = document.createElement('div');
                    rowItem.classList.add('candidates-row-item');
                    rowItem.classList.add('row-item-no-display');
                     if(i == (j * 3 + k)){
                        rowItem.innerHTML = (i + 1);
                        rowItem.classList.remove('row-item-no-display');
                    }
                    row.append(rowItem);
                }
                div.append(row);
            }
            candidateElements[i].append(div);
        }
        isNumbers = !isNumbers;
        return;
    }
}

function setNumbersContainer() {
    const candidateElements = document.querySelectorAll('.candidate-item');
        for(let i = 0; i < candidateElements.length; i++){
            candidateElements[i].innerHTML = (i + 1);
            candidateElements[i].addEventListener("click", () => {
                addNumber(candidateElements[i].innerHTML);
            });
    } 
}

function removeCurrentSelection() {
    const element = document.getElementById(currentRow + "," + currentCol);
    element.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
    interval = setInterval(() => {
        seconds++;
        if(seconds == 60){
            minutes++;
            seconds = 0;
        }
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        const formattedTime = `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
        document.getElementById('timer').innerHTML = `Timer: ${formattedTime}`;
    }, 1000);
    setNumbersContainer();
    readFromJSON();
});

document.getElementById("change-button").addEventListener("click", () => {
    changeNumbersContainer();
});

document.addEventListener("keydown", (event) => {
    if(event.key === 'Backspace'){
        removeCurrentSelection();
    }
});