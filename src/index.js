import API from "./apiCalls.js";
import Notiflix from "notiflix";
// Described in documentation
import SimpleLightbox from "simplelightbox";
// Additional styles import
import "simplelightbox/dist/simple-lightbox.min.css";
import { Spinner } from "spin.js";
var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-fade-quick", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: "#ffffff", // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  top: "50%", // Top position relative to parent
  left: "50%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: "spinner", // The CSS class to assign to the spinner
  position: "absolute", // Element positioning
};

//elements in HTML document
const refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  input: document.querySelector("input[type='text']"),
  buttonLoadMore: document.querySelector("button[type='button']"),
};

const target = refs.gallery;
const spinner = new Spinner(opts).spin(target);

//some of the variable that is used to complete checks and to improve user's experience

let pageCounter = null;
let totalHits = 0;
let queryParam;
let message;

//method to implement SimpleLightbox library
const onModalWindow = () => {
  const gallery = new SimpleLightbox(".photo-card a", {
    captionPosition: "bottom",
    captionsData: "alt",
    captionDelay: 250,
  });
  gallery.refresh();
};

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

  onModalWindow();
  pageSmoothScrolling();
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

    if (!totalHits || !data.hits.length) {
      refs.buttonLoadMore.classList.remove("visible");

      message =
        "Sorry, there are no images matching your search query. Please try again.";
      return notifyFailedMessage(message);
    }
    if (pageCounter === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images in total.`);
    }
    console.log(spinner);
    markupOfPictures(data);
  } catch (e) {
    console.log(e.message);
    message = "We're sorry, but you've reached the end of search results.";
    notifyFailedMessage(message);
    refs.buttonLoadMore.disabled = true;
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
    if (totalHits) {
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

// const handleInfiniteScroll = () => {
//   const endOfPage =
//     window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
//   if (endOfPage) {
//     if (totalHits > 520) {
//       message = "We're sorry, but you've reached the end of search results.";
//       return notifyFailedMessage(message);
//     }
//     gettingPhoto(queryParam, pageCounter);
//   }
// };

// window.addEventListener("scroll", handleInfiniteScroll);
