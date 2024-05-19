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
