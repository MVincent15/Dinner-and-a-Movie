var userZipCode;
var chosenFoodGenre;
var chosenMovieGenre;

var movieTitle = document.getElementById("movie-title");
var movieRelease = document.getElementById("movie-release");
var movieDuration = document.getElementById("movie-duration");
var movieOverview = document.getElementById("movie-overview");
var moviePoster = document.getElementById("movie-poster");
var oopsMessage = document.getElementById("oops");

var restaurantMap = document.getElementById("restaurant-map");
var zipCodeText = document.getElementById("zipcode");
var foodGenreText = document.getElementById("foodGenre");
var movieGenreText = document.getElementById("movieGenre");
var submitButton = document.getElementById("submit");
var zipCodeModal = document.getElementById("zipCodeModal");
var modalCloseButton = document.querySelector(".modal-close");

function init() {
  //pull items from local storage
  var storedMovieGenre = JSON.parse(localStorage.getItem("movieGenre"));
  var storedFoodGenre = JSON.parse(localStorage.getItem("foodGenre"));
  var storedZipCode = JSON.parse(localStorage.getItem("zipcode"));

  //checks if there are values pull from local storage, if so, fill in the form with it
  if (storedMovieGenre !== null) {
    movieGenreText.value = storedMovieGenre;
  }
  if (storedFoodGenre !== null) {
    foodGenreText.value = storedFoodGenre;
  }
  if (storedZipCode !== null) {
    zipCodeText.value = storedZipCode;
  }
  if (zipCodeText.value.length === 5) {
    submitButton.style.display = "block";
  }
  //generate restaurant map
  generateRestaurantMap();
  generateMovieChoices();
}

//check if zip code is not 5 digits, if not, it will present a modal and clear the text field
function validateZipCode() {
  var lettersAndSymbols =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-`~[]{}|;':,./<>?".split(
      ""
    );
  var userZipCode = zipCodeText.value;
  for (let i = 0; i < userZipCode.length; i++) {
    console.log(userZipCode[i]);
    if (lettersAndSymbols.includes(userZipCode[i])) {
      modalAndMap();
      return;
    }
  }
  if (userZipCode.length < 5 || userZipCode.length > 5) {
    modalAndMap();
  } else {
    generateRestaurantMap();
  }
}

function modalAndMap() {
  zipCodeModal.classList.add("is-active");
  zipCodeText.value = "";
  restaurantMap.classList.add("hidden");
  oopsMessage.classList.remove("hidden");
}

//updates the google map snippet with food genre and zip code
function generateRestaurantMap() {
  //if map is hidden, makes it reappear
  restaurantMap.classList.remove("hidden");
  //take user zipcode and cuisine selections
  userZipCode = zipCodeText.value;
  chosenFoodGenre = foodGenreText.value;

  //generate the API link
  var mapLink =
    "https://www.google.com/maps/embed/v1/search?key=AIzaSyCH6SpD7Rqx4pD0Y7ZsOK8h1wkkIbV8Ptg&q=" +
    chosenFoodGenre +
    "+restaurants+near+" +
    userZipCode;
  //add the link to the src attribute on the HTML page
  restaurantMap.setAttribute("src", mapLink);
}

function generateMovieChoices() {
  chosenMovieGenre = movieGenre.value;

  var movieLink =
    "https://api.themoviedb.org/3/discover/movie?api_key=9382d0b84dae3b5b2a9af9c9b2ba057e&with_genres=" +
    chosenMovieGenre;

  fetch(movieLink)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var movieResults = data.results.length;
      const randomIndex = Math.floor(Math.random() * movieResults);
      const randomMovie = data.results[randomIndex];

      var posterLink =
        "https://image.tmdb.org/t/p/original" + randomMovie.poster_path;

      movieTitle.textContent = randomMovie.title;
      movieRelease.textContent = randomMovie.release_date;
      movieOverview.textContent = randomMovie.overview;
      moviePoster.setAttribute("src", posterLink);
    });
}
function submitPreferences(event) {
  //prevent page from reloading
  event.preventDefault();
  //store each field into it's own slot in local storage
  localStorage.setItem("movieGenre", JSON.stringify(movieGenreText.value));
  localStorage.setItem("foodGenre", JSON.stringify(foodGenreText.value));
  localStorage.setItem("zipcode", JSON.stringify(zipCodeText.value));
  //generate the restaurant map
  validateZipCode();
  generateMovieChoices();
}
// hide the submit button until the user enters a zip code

submitButton.style.display = "none";

zipCodeText.addEventListener("input", () => {
  if (zipCodeText.value.trim().length === 5) {
    submitButton.style.display = "block";
  } else {
    submitButton.style.display = "none";
  }
});

//event listeners on buttons
submitButton.addEventListener("click", submitPreferences);
modalCloseButton.addEventListener("click", () => {
  zipCodeModal.classList.remove("is-active");
});

//runs on load
init();
