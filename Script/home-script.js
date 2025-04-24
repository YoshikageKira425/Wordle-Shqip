displayValue();
window.addEventListener('storage', displayValue)

document.body.classList.add("fade-in");
setTimeout(() => {
    document.body.classList.remove("fade-in");
}, 1000);

function displayValue(){
    document.getElementById('win').innerText =  localStorage.getItem('win');
    document.getElementById('lose').innerText = localStorage.getItem('lose');
    document.getElementById('game').innerText = (Number)(localStorage.getItem('lose')) + (Number)(localStorage.getItem('win'));
}