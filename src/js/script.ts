// HTML Elements
let darkModeButton = document.querySelector('header .dark-mode-button') as HTMLButtonElement;

// Initial Data
const darkMode = {
    status: false,
    toggle
}

// Events
    darkModeButton.addEventListener('click', darkMode.toggle);

// Functions
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