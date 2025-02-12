// Define your words and translations
const words = [
  { word: 'Hello', translation: '안녕하세요' },
  { word: 'Goodbye', translation: '안녕히 가세요' },
  { word: 'Please', translation: '제발요' },
  { word: 'Thank you', translation: '감사합니다' }
];

// Shuffle function to randomize the arrays
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Populate the word lists
function populateLists() {
  const list1 = document.getElementById('list1');
  const list2 = document.getElementById('list2');

  // Shuffle and create list items
  const shuffledWords = shuffle([...words]);
  const shuffledTranslations = shuffle([...words]);

  shuffledWords.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.word;
    li.classList.add('word-item');
    li.dataset.match = item.translation;
    li.dataset.side = 'left'; // Identify side
    list1.appendChild(li);
  });

  shuffledTranslations.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.translation;
    li.classList.add('word-item');
    li.dataset.match = item.translation;
    li.dataset.side = 'right'; // Identify side
    list2.appendChild(li);
  });
}

// Handle the matching logic
let selectedLeft = null;
let selectedRight = null;

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('word-item')) {
    const tile = e.target;
    const side = tile.dataset.side;

    // Check if the tile is already selected
    if (tile.classList.contains('pressed')) {
      resetTileStyle(tile); // Deselect the tile
      if (side === 'left') {
        selectedLeft = null;
      } else if (side === 'right') {
        selectedRight = null;
      }
      return; // Stop further processing
    }

    // Deselect the previously selected tile on the same side
    if (side === 'left' && selectedLeft) {
      resetTileStyle(selectedLeft);
    } else if (side === 'right' && selectedRight) {
      resetTileStyle(selectedRight);
    }

    // Select the current tile
    tile.classList.add('pressed');
    tile.style.backgroundColor = 'rgb(221, 244, 255)'; // Light blue
    tile.style.color = 'rgb(132, 216, 255)';           // Dark blue text
    tile.style.borderColor = 'rgb(132, 216, 255)';     // Dark blue border

    // Update selected tile references
    if (side === 'left') {
      selectedLeft = tile;
    } else if (side === 'right') {
      selectedRight = tile;
    }

    // Check for matches if both sides are selected
    if (selectedLeft && selectedRight) {
      const isMatch = selectedLeft.dataset.match === selectedRight.dataset.match;

      if (isMatch) {
        markMatch(selectedLeft, selectedRight, 'correct');
      } else {
        markMatch(selectedLeft, selectedRight, 'incorrect');
      }
    }
  }
});

function resetTileStyle(tile) {
  tile.classList.remove('pressed', 'correct', 'incorrect');
  tile.style.backgroundColor = '';
  tile.style.color = '';
  tile.style.borderColor = '';
  tile.style.boxShadow = ''; // Restore shadow effect
}

// Function to mark a match or mismatch
function markMatch(leftTile, rightTile, status) {
  leftTile.classList.remove('pressed');
  rightTile.classList.remove('pressed');
  leftTile.classList.add(status);
  rightTile.classList.add(status);

  if (status === 'correct') {
    onWordMatched();
    setTimeout(() => {
      leftTile.style.backgroundColor = 'rgb(255, 255, 255)'; // Gray after matched to illustrate no more interactivity
      leftTile.style.color = 'rgb(229, 229, 229)';
      leftTile.style.borderColor = 'rgb(229, 229, 229)';

      rightTile.style.backgroundColor = 'rgb(255, 255, 255)';
      rightTile.style.color = 'rgb(229, 229, 229)';
      rightTile.style.borderColor = 'rgb(229, 229, 229)';
    }, 400);

    leftTile.style.backgroundColor = 'rgb(215, 255, 184)'; // Green for matched
    leftTile.style.color = 'rgb(88, 204, 2)';
    leftTile.style.borderColor = 'rgb(88, 204, 2)';

    rightTile.style.backgroundColor = 'rgb(215, 255, 184)';
    rightTile.style.color = 'rgb(88, 204, 2)';
    rightTile.style.borderColor = 'rgb(88, 204, 2)';

    leftTile.style.pointerEvents = 'none'; // Disable further interaction
    rightTile.style.pointerEvents = 'none';
  } else {
    leftTile.style.backgroundColor = 'rgb(255, 223, 224)'; // Red for mismatched
    leftTile.style.color = 'rgb(255, 75, 75)';
    leftTile.style.borderColor = 'rgb(255, 75, 75)';

    rightTile.style.backgroundColor = 'rgb(255, 223, 224)';
    rightTile.style.color = 'rgb(255, 75, 75)';
    rightTile.style.borderColor = 'rgb(255, 75, 75)';
    setTimeout(() => {
      resetTileStyle(leftTile);
      resetTileStyle(rightTile);
    }, 400);
  }

  selectedLeft = null;
  selectedRight = null;
}

let totalMatches = 0; // Total correct matches
const milestones = [6, 12, 18]; // Milestone thresholds

function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const milestoneElements = milestones.map(m => document.getElementById(`milestone-${m}`));
  
  // Update the progress bar's width
  const progressPercentage = (totalMatches / milestones[milestones.length - 1]) * 100;
  progressBar.style.width = `${progressPercentage}%`;

  // Update milestone bubbles
  milestones.forEach((milestone, index) => {
    const milestoneElement = milestoneElements[index];
    if (totalMatches >= milestone) {
      milestoneElement.classList.add('active');
    } else {
      milestoneElement.classList.remove('active');
    }
  });
}

// Example of usage: Call this function whenever a match is made
function onWordMatched() {
  totalMatches++;
  if (totalMatches <= milestones[milestones.length - 1]) {
    updateProgressBar();
  }
}

// Simulate correct matches for demonstration
// Call onWordMatched() every time a word is correctly matched
// setInterval(() => {
//   if (totalMatches < 18) {
//     onWordMatched();
//   }
// }, 1000); // Simulates matches happening every second


// Initialize the game
populateLists();
