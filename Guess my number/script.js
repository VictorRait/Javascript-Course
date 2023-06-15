'use strict';
const secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
console.log(secretNumber);
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);

  console.log(secretNumber);
  if (!guess) {
    document.querySelector('.message').textContent = 'No number';
  } else if (guess > secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent = 'Too high!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'You lost! Try Again...';
      document.querySelector('.score').textContent = 0;
      score = 0;
    }
  } else if (guess < secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent = 'Too Low!';
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'You lost! Try Again...';
      document.querySelector('.score').textContent = 0;
      score = 0;
    }
  } else if (guess === secretNumber) {
    if (score >= 1) {
      document.querySelector('.message').textContent = 'You got it right!';
      document.querySelector('.number').style.width = '30rem';
      document.querySelector('body').style.backgroundColor = 'lightgreen';
      document.querySelector('.number').textContent = secretNumber;
    } else {
      document.querySelector('.message').textContent = 'You lost! Try Again...';
      document.querySelector('.score').textContent = 'Too late! Try Again...';
    }
  }
});
document.querySelector('.again').addEventListener('click', function () {
  const secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('.guess').value = '';
  score = 20;
  document.querySelector('.score').textContent = score;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').textContent = '?';
  document.querySelector('.message').textContent = 'Start guessing...';
  document.querySelector('.number').style.width = '15rem';

  console.log(secretNumber);
});
