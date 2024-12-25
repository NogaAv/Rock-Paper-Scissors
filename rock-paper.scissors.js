const options = ['rock', 'paper', 'scissors'];
let score = {
  wins: 0,
  looses: 0,
  tied: 0,
};

const localstrg = localStorage.getItem('score');
if (localstrg) {
  score = JSON.parse(localstrg);
}

const rockBtnElement = document.querySelector('.js-rock-move-btn');
rockBtnElement.addEventListener('click', () => play(options[0]));

document.querySelector('.js-paper-move-btn').addEventListener('click', () => play(options[1]));

document.querySelector('.js-paper-move-btn').addEventListener('click', () => {
  play(options[1]);
});

document.querySelector('.js-scissors-move-btn').addEventListener('click', () => {
  play(options[2]);
});

document.querySelector('.js-reset-score-btn').addEventListener('click', () => {
  displayResetConfirmation(true);
});

document.querySelector('.js-aoto-play-btn').addEventListener('click', () => {
  autoplay();
});

//These following two buttons confirm score reset
document.querySelector('.yes-btn').addEventListener('click', () => {
  resetScore();
  displayResetConfirmation(false);
});

document.querySelector('.no-btn').addEventListener('click', () => displayResetConfirmation(false));

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    autoplay();
  } else if (event.key === 'r') {
    play(options[0]);
  } else if (event.key === 'p') {
    play(options[1]);
  } else if (event.key === 's') {
    play(options[2]);
  } else if (event.key === 'Backspace') {
    displayResetConfirmation(true);
  }
});

updateScoreElement();

function resetScore() {
  score.wins = 0;
  score.looses = 0;
  score.tied = 0;

  localStorage.removeItem('score');
  updateScoreElement();
}

const autoBtn = {
  isAuto: false,
  intervalID: null,
};

function autoplay() {
  const { isAuto } = autoBtn;
  autoBtn.isAuto = !isAuto;
  if (autoBtn.isAuto) {
    document.querySelector('.aoto-play-btn').innerText = 'Stop Play';
    autoBtn.intervalID = setInterval(() => {
      const userAutoChoice = pickComputerMove();
      play(userAutoChoice);
    }, 1000);
  } else {
    document.querySelector('.aoto-play-btn').innerText = 'Auto Play';
    clearInterval(autoBtn.intervalID);
    autoBtn.intervalID = null;
  }
}

function play(choice) {
  if (!options.includes(choice)) {
    console.error('Bad choice');
    return;
  }
  const computerChoice = pickComputerMove();
  let result = '';
  if (computerChoice === choice) {
    result = 'Tied';
  } else {
    result = 'You ';
    switch (choice) {
      case 'rock':
        result += computerChoice === 'paper' ? 'lost' : 'win';
        break;
      case 'paper':
        result += computerChoice === 'scissors' ? 'lost' : 'win';
        break;
      case 'scissors':
        result += computerChoice === 'rock' ? 'lost' : 'win';
        break;
      default: {
        alert('Choices must be: rock, paper or scissors');
        return;
      }
    }
  }

  if (result.endsWith('lost')) {
    score.looses += 1;
  } else if (result.endsWith('win')) {
    score.wins += 1;
  } else {
    score.tied += 1;
  }

  //Using localStorage built-in object:
  localStorage.setItem('score', JSON.stringify(score));

  updateGameStatus(choice, computerChoice, result);
}

function updateGameStatus(userChoice, compChoice, result) {
  const currentScoreStatus = document.querySelector('.js-current-score-status');
  currentScoreStatus.innerText = result;

  const pickes = document.querySelector('.js-picks');
  pickes.innerHTML = `You <img src="../images/${userChoice}-emoji.png" class="move-icon"> <img src="../images/${compChoice}-emoji.png" class="move-icon"> Computer`;

  updateScoreElement();
}

function updateScoreElement() {
  document.querySelector('.js-score').innerText = `Wins: ${score.wins}, Looses: ${score.looses}, Ties: ${score.tied}`;
}

function pickComputerMove() {
  return options[Math.floor(Math.random() * options.length)];
}

function displayResetConfirmation(toDisplay) {
  if (toDisplay) {
    document.querySelector('.js-confirmation-msg').classList.add('display');
  } else {
    document.querySelector('.js-confirmation-msg').classList.remove('display');
  }
}
