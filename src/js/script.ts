// ---- HTML Elements ----
let darkModeButton = document.querySelector('header .dark-mode-button') as HTMLButtonElement;
let playerElement = document.querySelector('.player-area .player') as HTMLParagraphElement;
let table = document.querySelector('.table') as HTMLDivElement;

// ---- Initial Data ----
const darkMode = {
    status: false,
    toggle
}

let player: string = ( Math.round(Math.random()) ) ? 'X' : 'O';
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

    player = (player === 'X') ? 'O' : 'X';
    renderInfo();
}

// info
function renderInfo() {
    if(gameStatus === false) {
        playerElement.setAttribute('draggable', 'false');
    } else {
        playerElement.setAttribute('draggable', 'true');
    }

    playerElement.innerHTML = player;
}

// validations 
