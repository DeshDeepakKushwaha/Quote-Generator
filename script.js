const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const favouriteIcon = document.getElementById("favourite");
const favouritesContainer = document.getElementById("favourites-container");
const showfavourite = document.getElementById("show-favourites");
const showhome = document.getElementById("homeBtn");

let apiQuotes = []; //an array of all the quotes(objects)
let quote = {}; //an object which stores the quote at random
let favouriteQuotes = []; //an array which stores the favourite quote

// Show Loading
function showLoadingSymbol() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// Remove Loading Symbol
function removeLoadingSymbol() {
  quoteContainer.hidden = false;
  loader.hidden = true;
}

const addQuoteToFavourites = function () {
  saveToLocalFavourites(quote);
};

const saveToLocalFavourites = function (favourite) {
  let favouriteQuotesJsonString = localStorage.getItem("favouriteQuotes");
  if (favouriteQuotesJsonString != null)
    favouriteQuotes = JSON.parse(favouriteQuotesJsonString);
  const validateQuote = favouriteQuotes.find((q) => q.text === favourite.text);
  if (!validateQuote) {
    favouriteQuotes.push(favourite);
    favouriteIcon.style.color = "red";
  }
  // If it's already a favourite then remove the quote from the favourite list and change the icon color to grey
  else {
    removeQuoteFromFavourites(favourite);
    favouriteIcon.style.color = "grey";
  }
  favouriteQuotesJsonString = JSON.stringify(favouriteQuotes);
  localStorage.setItem("favouriteQuotes", favouriteQuotesJsonString);
};

const removeQuoteFromFavourites = function (favourite) {
  const indexToBeDeleted = favouriteQuotes.findIndex(
    (q) => q.text === favourite.text
  );
  favouriteQuotes.splice(indexToBeDeleted, 1);

  let favouriteQuotesJsonString = JSON.stringify(favouriteQuotes);
  localStorage.setItem("favouriteQuotes", favouriteQuotesJsonString);
};

const showFavouriteQuotes = function () {
  favouriteQuotes = JSON.parse(localStorage.getItem("favouriteQuotes"));
  for (let index = 0; index < favouriteQuotes.length; index++) {
    const quotePar = document.createElement("p");
    quotePar.className = "fav-q-par";
    quotePar.id = "fav" + index;
    favouritesContainer.appendChild(quotePar);

    if (!favouriteQuotes[index].author)
      favouriteQuotes[index].author = "Author Unknown";
    let quoteParId = document.getElementById(`${quotePar.id}`);
    quoteParId.innerHTML = `<i class="fas fa-heart heart" title="remove from favourites" id="${index}" style="color:red"></i>&nbsp;${favouriteQuotes[index].text} (${favouriteQuotes[index].author})`;
  }
  let heart = document.querySelectorAll(".heart");
  favouritesContainer.addEventListener("click", function (e) {
    const clicked = e.target;
    const quoteToRemove = {};
    //take only the text part from the quote (without the author) and save it as a property in the quoteToRemove obj
    let removeQuote = document.getElementById(`fav${clicked.id}`);
    console.log(removeQuote);
    removeQuote.style.display = "none";
    removeQuoteFromFavourites(quoteToRemove); // remove the quote from the local storage
  });
};

showfavourite.addEventListener("click", function () {
  quoteContainer.hidden = true;
  favouritesContainer.hidden = false;
  favouritesContainer.innerHTML =
    "<h2>your favourite quotes</h2><h4>to remove a quote - click on the heart<h4>";
  showFavouriteQuotes();
});

showhome.addEventListener("click", function () {
  quoteContainer.hidden = false;
  favouritesContainer.hidden = true;
  getQuotes();
});

newQuote = function () {
  showLoadingSymbol();
  favouriteIcon.style.color = "grey";
  quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  if (!quote.author) authorText.textContent = "Unknown";
  else authorText.textContent = quote.author;
  quoteText.textContent = quote.text;
  removeLoadingSymbol();
};

//get quotes from the api
getQuotes = async function () {
  showLoadingSymbol();
  const apiUrl = "https://type.fit/api/quotes";
  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    console.log(apiQuotes);
    newQuote();
  } catch (err) {
    console.error(err.message);
  }
  removeLoadingSymbol();
};
getQuotes();

tweetQuote = function () {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote.text} -${quote.author}`;
  window.open(twitterUrl);
};

twitterBtn.addEventListener("click", tweetQuote);
newQuoteBtn.addEventListener("click", getQuotes);
