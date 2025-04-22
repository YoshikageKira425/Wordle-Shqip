document.getElementById('win').innerText =  localStorage.getItem('win');
document.getElementById('lose').innerText = localStorage.getItem('lose');
document.getElementById('game').innerText = (Number)(localStorage.getItem('lose')) + (Number)(localStorage.getItem('win'));
