import API from "./apiCalls.js";
import Notiflix from "notiflix";
//elements in HTML document
refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  input: document.querySelector("input[type='text']"),
  buttonSubmit: document.querySelector("button[type='submit']"),
  buttonLoadMore: document.querySelector("button[type='button']"),
};

//some of the variable that is used to complete checks and to improve user's experience
let pageCounter = null;
let queryParam;
let totalNumOfPictures;
let message;

//load btn is not visible for the user on the beginning
refs.buttonLoadMore.style.display = "none";

//markuap method for the card
const markupOfPictures = (data) => {
  const { hits } = data;
  const markup = hits
    .map(
      ({
        id,
        comments,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        downloads,
      }) => {
        return `<div data-id=${id} class="photo-card">
  <img src=${webformatURL} alt="${tags}" loading="lazy" width="300" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup);
};

//general method for notification with failed methods
const notifyFailedMessage = (message) => {
  Notiflix.Notify.failure(message);
};

//getting pictures from public api using axios library
async function gettingPhoto(queryParam, pageCounter) {
  try {
    const response = await API.getPictures(queryParam, pageCounter);
    const data = await response.data;
    totalNumOfPictures = data.total;

    if (!totalNumOfPictures || !data.hits.length) {
      refs.buttonLoadMore.style.display = "none";
      message =
        "Sorry, there are no images matching your search query. Please try again.";
      notifyFailedMessage(message);
    }
    markupOfPictures(data);
  } catch (e) {
    console.log(e.message);
    message = "We're sorry, but you've reached the end of search results.";
    notifyFailedMessage(message);
    refs.buttonLoadMore.disabled = true;
  }
}

//function that is called on submit
const onSubmit = (e) => {
  e.preventDefault();
  refs.gallery.innerHTML = "";

  pageCounter = 1;
  const { searchQuery } = e.target.elements;
  queryParam = searchQuery.value.trim();

  gettingPhoto(queryParam, pageCounter);

  searchQuery.value = null;
  refs.buttonSubmit.disabled = true;

  refs.form.reset();

  setTimeout(() => {
    if (totalNumOfPictures) {
      refs.buttonLoadMore.style.display = null;
    }
  }, 500);
};

//function that is called when user would like to get more pictures displayed after initial getCall
const onLoadMore = () => {
  pageCounter += 1;
  gettingPhoto(queryParam, pageCounter);
};

//function makes submit button enabled, if user have provided some input into the search images field
const onInput = (e) => {
  if (e.target.value) {
    refs.buttonSubmit.disabled = false;
  }
};

refs.input.addEventListener("input", onInput);
refs.form.addEventListener("submit", onSubmit);
refs.buttonLoadMore.addEventListener("click", onLoadMore);
