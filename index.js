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

let currentSound = null;
let currentLetter = null;
let isCorrect = null;

// Event listener for the "Play Sound" button inside the modal
document.querySelector(".sound-btn").addEventListener("click", function () {
  var audioFile = modal.dataset.audioFile;
  if (audioFile) {
    playSound(audioFile);
  }
});

function getRandomConsonant() {
  const randomIndex = Math.floor(Math.random() * assessVowels.vowels.length);
  return assessVowels.vowels[randomIndex];
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

function showToast(message, isCorrect, words = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.toggle("correct", isCorrect);
  toast.classList.toggle("incorrect", !isCorrect);
  toast.style.display = "block";
  setTimeout(() => {
    if (!words) {
      document.querySelector(".empty-container").innerHTML = "";
    }

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

function addLetterClickListeners() {
  const letters = document.querySelectorAll(".letters-overlay-second .letter");
  const lineContainer = document.querySelector(".clicked-letters-container");

  // Function to handle click on currentLetters
  function handleCurrentLetterClick(event) {
    const clickedLetter = event.target;

    // Remove the clicked letter from the lineContainer
    lineContainer.removeChild(clickedLetter);

    // Find the corresponding letter in the letters collection and remove 'in-line' class
    letters.forEach((letter) => {
      if (letter.textContent === clickedLetter.textContent) {
        letter.classList.remove("in-line");
      }
    });

    // Enable other letters if less than 3 letters in lineContainer
    if (lineContainer.querySelectorAll(".letter").length < 3) {
      letters.forEach((letter) => {
        if (!letter.classList.contains("in-line")) {
          letter.classList.remove("disabled");
        }
      });
    }
  }

  letters.forEach((letter) => {
    letter.addEventListener("click", function () {
      const currentLetters = lineContainer.querySelectorAll(".letter");
      if (currentLetters.length < 3 || this.classList.contains("in-line")) {
        if (this.classList.contains("in-line")) {
          const letterToRemove = Array.from(lineContainer.children).find(
            (child) => child.textContent === this.textContent
          );
          handleCurrentLetterClick({ target: letterToRemove });
        } else {
          const lineLetter = document.createElement("div");
          lineLetter.classList.add("letter");
          lineLetter.textContent = this.textContent;

          lineLetter.addEventListener("click", handleCurrentLetterClick); // Add click listener to currentLetter

          lineContainer.appendChild(lineLetter);
          this.classList.add("disabled", "in-line");
        }

        if (lineContainer.querySelectorAll(".letter").length < 3) {
          letters.forEach((letter) => {
            if (!letter.classList.contains("in-line")) {
              letter.classList.remove("disabled");
            }
          });
        }

        if (lineContainer.querySelectorAll(".letter").length === 3) {
          const currentWord = Array.from(
            lineContainer.querySelectorAll(".letter")
          )
            .map((letter) => letter.textContent)
            .join("");

          while (lineContainer.firstChild) {
            lineContainer.removeChild(lineContainer.firstChild);
          }
          letters.forEach((letter) => {
            letter.classList.remove("disabled", "in-line");
          });

          console.log(currentWord);
          const currentQuestionWord = Array.from(
            assessmentPart2.questions[currentQuestionIndex].word
          ).join("");
          if (currentWord === currentQuestionWord) {
            // Words match, generate new letters and sounds
            isCorrect = new Howl({
              src: "./audio/correct.mp3",
            });

            showToast("Correct!", true, true);
            populateLettersOverlay(
              Math.floor(Math.random() * assessmentPart2.questions.length)
            );
          } else {
            isCorrect = new Howl({
              src: "./audio/incorrect.mp3",
            });
            showToast("Incorrect!", false, true);
          }
          isCorrect.play();
        }
      }
    });
  });
}

addLetterClickListeners();

let currentQuestionIndex = 0;

// Populate the letters-overlay-second container with one question's letters
function populateLettersOverlay(questionIndex) {
  currentQuestionIndex = questionIndex;

  const lettersOverlay = document.querySelector(".letters-overlay-second");
  lettersOverlay.innerHTML = ""; // Clear existing content

  const soundContainers = document.querySelectorAll(".sound-container-second");
  soundContainers.forEach((container, index) => {
    const letter = assessmentPart2.questions[questionIndex].word[index];
    const audioObj = assessmentPart2.questions[questionIndex].audio.find(
      (obj) => obj.letter === letter
    );
    if (audioObj) {
      container.dataset.audio = audioObj.audio;
    } else {
      console.error(`Audio object not found for letter: ${letter}`);
    }
  });

  if (questionIndex >= 0 && questionIndex < assessmentPart2.questions.length) {
    const question = assessmentPart2.questions[questionIndex];
    question.audio.forEach((letters) => {
      const letterElement = document.createElement("div");
      letterElement.classList.add("letter");
      letterElement.dataset.letter = letters.letter;
      letterElement.textContent = letters.letter;
      lettersOverlay.appendChild(letterElement);
    });
    addLetterClickListeners();
  } else {
    console.error("Invalid question index");
  }
}

// Example: Populate the letters overlay with the first question's letters
populateLettersOverlay(
  Math.floor(Math.random() * assessmentPart2.questions.length)
);

function handleSoundContainerClick() {
  const soundContainers = document.querySelectorAll(".sound-container-second");

  soundContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const audioSrc = container.dataset.audio;

      const sound = new Howl({
        src: [audioSrc],
      });

      sound.play();
    });
  });
}

handleSoundContainerClick();

// Initially show the home section
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
});

document.addEventListener("DOMContentLoaded", function () {
  const pagination = document.querySelector(".pagination");

  function addPaginationListeners() {
    const paginationLinks = document.querySelectorAll(
      ".pagination .page-number"
    );

    paginationLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const pageNumber = this.getAttribute("data-page");

        // Update active class
        paginationLinks.forEach((link) => link.classList.remove("active"));
        this.classList.add("active");

        // Update content based on the page number
        updateContent(pageNumber);
      });
    });
  }

  function updateContent(pageNumber) {
    console.log(pageNumber);
    switch (pageNumber) {
      case "1":
        document.querySelector(".image-container").style.display = "flex";
        document.querySelector(".second-container").style.display = "none";
        document.querySelector(".label").innerHTML = "Vowel Sounds";
        break;
      case "2":
        document.querySelector(".image-container").style.display = "none";
        document.querySelector(".second-container").style.display = "flex";
        document.querySelector(".label").innerHTML = "Letter Sounds Blending";
        break;
      default:
        content = "No content available for this page.";
    }

    // Reattach pagination event listeners
    addPaginationListeners();
  }

  // Initial setup
  addPaginationListeners();
});
