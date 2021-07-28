"use strict";
let darkModeButton = document.querySelector('header .dark-mode-button');
let playerElement = document.querySelector('.player-area .player');
let scoreX = document.querySelector('.score .score-x');
let scoreO = document.querySelector('.score .score-o');
let table = document.querySelector('.table');
let modal = document.querySelector('main .modal');
let continueButton = document.querySelector('#continue-button');
let restartButton = document.querySelector('#restart-button');
const darkMode = {
    status: false,
    toggle
};
let virtualTable = {
    a1: '', a2: '', a3: '',
    b1: '', b2: '', b3: '',
    c1: '', c2: '', c3: ''
};
let player = (Math.round(Math.random())) ? 'X' : 'O';
const score = {
    X: 0,
    O: 0
};
let gameStatus = true;
renderInfo();
darkModeButton.addEventListener('click', darkMode.toggle);
playerElement.addEventListener('dragstart', dragStartPlayerElement);
playerElement.addEventListener('dragend', dragEndPlayerElement);
table.addEventListener('dragover', dragOverTable);
table.addEventListener('dragleave', dragLeaveTable);
table.addEventListener('drop', dropOnTable);
continueButton.addEventListener('click', continueTheGame);
restartButton.addEventListener('click', resetGame);
function toggle(e) {
    let className = (darkMode.status) ? 'dark-mode' : 'light-mode';
    let elements = document.querySelectorAll('.' + className);
    let darkModeIndicatorElement = document.querySelector('.dark-mode-button .dark-mode-indicator');
    elements.forEach(element => {
        element.classList.remove(className);
        element.classList.add((className === 'dark-mode') ? 'light-mode' : 'dark-mode');
    });
    darkModeIndicatorElement.classList.toggle('active');
    darkMode.status = (darkMode.status) ? false : true;
}
function dragStartPlayerElement(e) {
    let element = e.currentTarget;
    element.classList.add('dragging');
}
function dragEndPlayerElement(e) {
    let element = e.currentTarget;
    element.classList.remove('dragging');
}
function dragOverTable(e) {
    let element = e.target;
    if (element.innerHTML || gameStatus === false) {
        return;
    }
    e.preventDefault();
    element.classList.add('overOption');
}
function dragLeaveTable(e) {
    let element = e.target;
    element.classList.remove('overOption');
}
function dropOnTable(e) {
    let element = e.target;
    element.classList.remove('overOption');
    element.innerHTML = player;
    synchronizeVirtualTable(element.getAttribute('data-option'));
    checkWinner();
    checkTheGameTableIsFull();
    player = (player === 'X') ? 'O' : 'X';
    renderInfo();
}
function synchronizeVirtualTable(key) {
    if (key === null) {
        return;
    }
    if (key === 'a1' || key === 'a2' || key === 'a3' ||
        key === 'b1' || key === 'b2' || key === 'b3' ||
        key === 'c1' || key === 'c2' || key === 'c3') {
        virtualTable[key] = player;
    }
}
function resetTable() {
    for (let key in virtualTable) {
        if (key === 'a1' || key === 'a2' || key === 'a3' ||
            key === 'b1' || key === 'b2' || key === 'b3' ||
            key === 'c1' || key === 'c2' || key === 'c3') {
            virtualTable[key] = '';
            let itemTable = table.querySelector(`div[data-option=${key}]`);
            itemTable.innerHTML = '';
        }
    }
}
function renderInfo() {
    if (gameStatus === false) {
        playerElement.setAttribute('draggable', 'false');
    }
    else {
        playerElement.setAttribute('draggable', 'true');
    }
    playerElement.innerHTML = player;
    scoreX.innerHTML = '<b>X</b>' + score.X.toString();
    scoreO.innerHTML = '<b>O</b>' + score.O.toString();
}
function checkTheGameTableIsFull() {
    for (let key in virtualTable) {
        if (key === 'a1' || key === 'a2' || key === 'a3' ||
            key === 'b1' || key === 'b2' || key === 'b3' ||
            key === 'c1' || key === 'c2' || key === 'c3') {
            if (virtualTable[key] === '') {
                return;
            }
        }
    }
    gameStatus = false;
}
function checkWinner() {
    let possibilities = [
        'a1,a2,a3',
        'b1,b2,b3',
        'c1,c2,c3',
        'a1,b1,c1',
        'a2,b2,c2',
        'a3,b3,c3',
        'a1,b2,c3',
        'a3,b2,c1'
    ];
    possibilities.forEach(possibilitie => {
        let keys = possibilitie.split(',');
        let haveAWinner = false;
        haveAWinner = keys.every(key => {
            if (key === 'a1' || key === 'a2' || key === 'a3' ||
                key === 'b1' || key === 'b2' || key === 'b3' ||
                key === 'c1' || key === 'c2' || key === 'c3') {
                return virtualTable[key] === player;
            }
        });
        if (haveAWinner) {
            score[player] = score[player] + 1;
            gameStatus = false;
            renderResult(player);
        }
    });
}
function renderResult(winner) {
    let winnerH1 = document.querySelector('main .modal .result h1');
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = '1', 150);
    winnerH1.innerHTML = 'O vencedor foi ' + winner + '!';
}
function continueTheGame() {
    resetTable();
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 500);
    gameStatus = true;
    renderInfo();
}
function resetGame() {
    resetTable();
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 500);
    score.X = 0;
    score.O = 0;
    gameStatus = true;
    renderInfo();
}