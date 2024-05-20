var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on a consonant button, open the modal
var consonantButtons = document.querySelectorAll(".block.consonants .letter");
var sounds = {}; // Object to store Howl instances

consonantButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var letter = this.innerText;
    document.getElementById("consonantLetter").innerText = letter;
    modal.style.display = "block";

    // Set the current audio file to be played
    var audioFile = "audio/" + letter.toLowerCase() + ".wav";
    modal.dataset.audioFile = audioFile; // Store the audio file in the modal's dataset
  });
});

// Event listener for the "Play Sound" button inside the modal
document.querySelector(".sound-btn").addEventListener("click", function () {
  var audioFile = modal.dataset.audioFile;
  if (audioFile) {
    playSound(audioFile);
  }
});

let currentSound = null;
let currentLetter = null;
let isCorrect = null;

function getRandomConsonant() {
  const randomIndex = Math.floor(
    Math.random() * assessConsonants.consonants.length
  );
  return assessConsonants.consonants[randomIndex];
}

function playAssessSound() {
  if (currentSound) {
    currentSound.play();
  } else {
    const consonant = getRandomConsonant();
    currentLetter = consonant.letter;
    currentSound = new Howl({
      src: [consonant.audio],
    });
    currentSound.play();
  }
}

function showToast(message, isCorrect) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.toggle("correct", isCorrect);
  toast.classList.toggle("incorrect", !isCorrect);
  toast.style.display = "block";
  setTimeout(() => {
    document.querySelector(".empty-container").innerHTML = "";
    toast.style.display = "none";
  }, 2000);
}

document
  .querySelector(".sound-container")
  .addEventListener("click", playAssessSound);

document
  .querySelectorAll(".letters-overlay .letter")
  .forEach((letterElement) => {
    letterElement.addEventListener("click", (event) => {
      if (currentLetter == null) {
        isCorrect = new Howl({
          src: "./audio/incorrect.mp3",
        });
        isCorrect.play();
        showToast("Click sound first!", false);
      } else {
        const clickedLetter = event.target.textContent;
        document.querySelector(".empty-container").innerHTML = currentLetter;
        if (clickedLetter === currentLetter) {
          isCorrect = new Howl({
            src: "./audio/correct.mp3",
          });

          showToast("Correct!", true);
        } else {
          isCorrect = new Howl({
            src: "./audio/incorrect.mp3",
          });
          showToast(`Incorrect! Correct letter: ${currentLetter}`, false);
        }
        isCorrect.play();
        currentSound = null;
      }
    });
  });

function playSound(audioFile) {
  if (!sounds[audioFile]) {
    // Create a new Howl instance if it doesn't exist
    sounds[audioFile] = new Howl({
      src: [audioFile],
    });
  }

  sounds[audioFile].play();
}

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", function () {
  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

var vowelButtons = document.querySelectorAll(".block.vowels .letter");

// Attach click event listeners to each vowel button
vowelButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Show the video popup
    document.querySelector("#popupVideo").style.display = "block";
    document.querySelector(".closeButton").style.display = "block";
  });
});

function closePopup() {
  document.querySelector("#popupVideo").style.display = "none";
  document.querySelector(".closeButton").style.display = "none";
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  // Show the selected section
  document.getElementById(sectionId).style.display = "block";
}

// Initially show the home section
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
});
