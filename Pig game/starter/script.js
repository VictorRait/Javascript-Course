'use strict';
// Selecting elements
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
let currentScore = 0;
let score = [0, 0];
let activePlayer = 0;
let playing = true;

//  Starting Conditions
score0El.textContent = 0;

score1El.textContent = 0;
diceEl.classList.add('hidden');
current0El.classList.add('currentPlayer');
const currentPlayer = function () {
  if (current0El.classList.contains('currentPlayer')) {
    current0El.textContent = currentScore;
  } else if (current1El.classList.contains('currentPlayer')) {
    current1El.textContent = currentScore;
  }
};
const switchPlayer = function () {
  document.querySelector(`.player--0`).classList.toggle('player--active');
  document.querySelector(`.player--1`).classList.toggle('player--active');

  if (current0El.classList.contains('currentPlayer')) {
    current0El.classList.remove('currentPlayer');
    current0El.textContent = 0;
    current1El.classList.add('currentPlayer');
  } else if (current1El.classList.contains('currentPlayer')) {
    current1El.classList.remove('currentPlayer');
    current1El.textContent = 0;
    current0El.classList.add('currentPlayer');
  }
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;
    console.log('Button roll is clicked');
    if (dice !== 1) {
      currentScore += dice;
      currentPlayer();
    } else {
      activePlayer = activePlayer === 0 ? 1 : 0;
      switchPlayer();

      currentScore = 0;
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    score[activePlayer] += currentScore;

    console.log(score[1]);
    document.querySelector(`#score--${activePlayer}`).textContent =
      score[activePlayer];
    console.log(score[activePlayer]);

    if (score[activePlayer] >= 20) {
      // add current score to score
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      diceEl.classList.add('hidden');

      playing = false;
      console.log(`playing is ${playing}`);
    } else {
      switchPlayer();
      activePlayer = activePlayer === 0 ? 1 : 0;
    }
    // check if score is greater  or equal to 20
    // winner class
    // remove dice
  }
});
btnNew.addEventListener('click', function () {
  // reset color
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove('player--winner');

  // reset score
  score = [0, 0];
  score0El.textContent = 0;
  score1El.textContent = 0;
  // reset current
  currentScore = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  // set playing to true
  playing = true;
  current0El.classList.add('currentPlayer');
  current1El.classList.remove('currentPlayer');
});
