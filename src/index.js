import API from "./apiCalls.js";
import Notiflix from "notiflix";
import { _gallery } from "./simpleLightbox.js";

//elements in HTML document
const refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  input: document.querySelector("input[type='text']"),
  buttonLoadMore: document.querySelector("button[type='button']"),
};

//some of the variable that is used to complete checks and to improve user's experience
let pageCounter = null;
let totalHits = 0;
let totalPages = [];
let queryParam;
let message;

const pageSmoothScrolling = () => {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
};

//markup method for the card
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
        <a class="gallery__link" href="${largeImageURL}">
  <img class="picture" src=${webformatURL} alt="${tags}" loading="lazy" width="350" />
       </a>
  <div class="info">
    <p class="info-item">
      <b>Likes <br /> <span>${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <br /> <span>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <br /> <span>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <br /> <span>${downloads}</span></b>
    </p>
  </div>
</div>`;
      }
    )
    .join("");
  refs.gallery.insertAdjacentHTML("beforeend", markup);
  if (pageCounter > 1) {
    pageSmoothScrolling();
  }
  _gallery.refresh();
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
    totalHits = Number(data.totalHits);
    totalPages = Math.ceil(Number(data.totalHits) / 40);

    if (!totalHits || !data.hits.length) {
      refs.buttonLoadMore.classList.remove("visible");
      message =
        "Sorry, there are no images matching your search query. Please try again.";
      return notifyFailedMessage(message);
    }

    if (pageCounter === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images in total.`);
    }
    markupOfPictures(data);
    if (totalPages === pageCounter) {
      refs.buttonLoadMore.classList.remove("visible");
      message = "We're sorry, but you've reached the end of search results.";
      notifyFailedMessage(message);
    }
  } catch (e) {
    console.log(e.message);
    message = "We're sorry, but you've reached the end of search results.";
    refs.buttonLoadMore.classList.remove("visible");

    notifyFailedMessage(message);
  }
}

//function to check search input field on empty string
const onEmptyString = (message) => {
  refs.buttonLoadMore.classList.remove("visible");
  return notifyFailedMessage(message);
};

//function that is called on submit
const onSubmit = (e) => {
  e.preventDefault();
  pageCounter = 1;
  const { searchQuery } = e.target.elements;
  queryParam = searchQuery.value.trim();

  //checking search input field on empty string
  if (!queryParam.length) {
    message = "Please type in some search key word";
    return onEmptyString(message);
  }
  refs.gallery.innerHTML = "";

  gettingPhoto(queryParam, pageCounter);

  searchQuery.value = null;
  totalHits = 0;
  refs.form.reset();

  setTimeout(() => {
    if (totalPages === pageCounter || !totalPages) {
      refs.buttonLoadMore.classList.remove("visible");
    } else {
      refs.buttonLoadMore.classList.add("visible");
    }
  }, 500);
};

// function that is called when user would like to get more pictures displayed after initial getCall
const onLoadMore = () => {
  pageCounter += 1;
  gettingPhoto(queryParam, pageCounter);
};

refs.form.addEventListener("submit", onSubmit);
refs.buttonLoadMore.addEventListener("click", onLoadMore);
