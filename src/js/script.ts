// ---- Types ----
type gameTable = {
    a1: '' | 'O' | 'X', 
    a2: '' | 'O' | 'X', 
    a3: '' | 'O' | 'X',
    b1: '' | 'O' | 'X', 
    b2: '' | 'O' | 'X', 
    b3: '' | 'O' | 'X',
    c1: '' | 'O' | 'X', 
    c2: '' | 'O' | 'X', 
    c3: '' | 'O' | 'X'
};
type playerOptions = 'X' | 'O';


// ---- HTML Elements ----
let darkModeButton = document.querySelector('header .dark-mode-button') as HTMLButtonElement;

let playerElement = document.querySelector('.player-area .player') as HTMLParagraphElement;
let scoreX = document.querySelector('.score .score-x') as HTMLDivElement;
let scoreO = document.querySelector('.score .score-o') as HTMLDivElement;

let table = document.querySelector('.table') as HTMLDivElement;
let modal = document.querySelector('main .modal') as HTMLDivElement;

let continueButton = document.querySelector('#continue-button') as HTMLButtonElement;
let restartButton = document.querySelector('#restart-button') as HTMLButtonElement;

// ---- Initial Data ----
const darkMode = {
    status: false,
    toggle
}

let virtualTable: gameTable = {
    a1: '', a2: '', a3: '',
    b1: '', b2: '', b3: '',
    c1: '', c2: '', c3: ''
}

let player: playerOptions = ( Math.round(Math.random()) ) ? 'X' : 'O';
const score = {
    X: 0,
    O: 0
};

let gameStatus: boolean = true;

renderInfo();


// ---- Events ----
// dark mode
darkModeButton.addEventListener('click', darkMode.toggle);

// player 
playerElement.addEventListener('dragstart', dragStartPlayerElement);
playerElement.addEventListener('dragend', dragEndPlayerElement);

// table
table.addEventListener('dragover', dragOverTable);
table.addEventListener('dragleave', dragLeaveTable);
table.addEventListener('drop', dropOnTable);

// modal
continueButton.addEventListener('click', continueTheGame);
restartButton.addEventListener('click', resetGame);

// ---- Functions ----
// dark mode
function toggle(e: Event) {
    let className = (darkMode.status) ? 'dark-mode' : 'light-mode';
    let elements = document.querySelectorAll('.' + className);
    let darkModeIndicatorElement = document.querySelector('.dark-mode-button .dark-mode-indicator') as HTMLDivElement;

    elements.forEach(element => {
        element.classList.remove(className);
        element.classList.add((className === 'dark-mode') ? 'light-mode': 'dark-mode');
    });

    darkModeIndicatorElement.classList.toggle('active');
    darkMode.status = (darkMode.status) ? false : true;
}

// player
function dragStartPlayerElement(e: Event) {
    let element = e.currentTarget as HTMLParagraphElement;
    
    element.classList.add('dragging');
}
function dragEndPlayerElement(e: Event) {
    let element = e.currentTarget as HTMLParagraphElement;
    element.classList.remove('dragging');
}

//table
function dragOverTable(e: Event) {
    let element = e.target as HTMLDivElement;
    
    if(element.innerHTML || gameStatus === false) {
        return;
    }
    
    e.preventDefault();
    element.classList.add('overOption');
}
function dragLeaveTable(e: Event) {
    let element = e.target as HTMLDivElement;
    element.classList.remove('overOption');
}
function dropOnTable(e: Event) {
    let element = e.target as HTMLDivElement;
    
    element.classList.remove('overOption');
    element.innerHTML = player;

    synchronizeVirtualTable(element.getAttribute('data-option'));
    checkWinner();
    checkTheGameTableIsFull();

    player = (player === 'X') ? 'O' : 'X';
    renderInfo();
}
function synchronizeVirtualTable(key: string | null) {
    if(key === null) {
        return;
    }

    if( key === 'a1' || key === 'a2' || key === 'a3' || 
        key === 'b1' || key === 'b2' || key === 'b3' ||
        key === 'c1' || key === 'c2' || key === 'c3') {
            virtualTable[key] = player;
    }
}
function resetTable() {
    for(let key in virtualTable) {
        if( key === 'a1' || key === 'a2' || key === 'a3' || 
        key === 'b1' || key === 'b2' || key === 'b3' ||
        key === 'c1' || key === 'c2' || key === 'c3') {
            virtualTable[key] = '';

            let itemTable = table.querySelector(`div[data-option=${key}]`) as HTMLDivElement;
            itemTable.innerHTML = '';
        }
    }
}

// info
function renderInfo() {
    if(gameStatus === false) {
        playerElement.setAttribute('draggable', 'false');
    } else {
        playerElement.setAttribute('draggable', 'true');
    }

    playerElement.innerHTML = player;
    
    scoreX.innerHTML = '<b>X</b>' + score.X.toString();
    scoreO.innerHTML = '<b>O</b>' + score.O.toString();
}

// validations 
function checkTheGameTableIsFull() {
    for(let key in virtualTable) {
        if( key === 'a1' || key === 'a2' || key === 'a3' || 
            key === 'b1' || key === 'b2' || key === 'b3' ||
            key === 'c1' || key === 'c2' || key === 'c3') {
            
            if(virtualTable[key] === '') {
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
        let haveAWinner: boolean = false;

        haveAWinner = keys.every(key => {
            if( key === 'a1' || key === 'a2' || key === 'a3' || 
                key === 'b1' || key === 'b2' || key === 'b3' ||
                key === 'c1' || key === 'c2' || key === 'c3') {
                    return virtualTable[key] === player;
            }
        });

        if(haveAWinner) {
            score[player] = score[player] + 1 ;
            gameStatus = false;

            renderResult(player);
        }
    });
}

// modal
function renderResult(winner: string) {
    let winnerH1 = document.querySelector('main .modal .result h1') as HTMLHeadingElement;
    
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