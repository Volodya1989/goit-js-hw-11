import API from "./apiCalls.js";
import Notiflix from "notiflix";

refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  buttonLoadMore: document.querySelector("button[type='button']"),
};
refs.buttonLoadMore.style.display = "none";

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
let pageCounter = null;
let queryParam;
let totalNumOfPictures;
async function gettingPhoto(queryParam, pageCounter) {
  try {
    const response = await API.getPictures(queryParam, pageCounter);
    const data = await response.data;
    console.log(totalNumOfPictures);

    totalNumOfPictures = data.total;

    if (!totalNumOfPictures) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    }

    markupOfPictures(data);
  } catch (e) {
    console.log(e.message);
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.buttonLoadMore.disabled = true;
  }
}
const onInput = (e) => {
  e.preventDefault();
  refs.gallery.innerHTML = "";

  pageCounter = 1;
  const { searchQuery } = e.target.elements;
  queryParam = searchQuery.value;
  gettingPhoto(queryParam, pageCounter);

  searchQuery.value = "";
  refs.form.reset();
  setTimeout(() => {
    if (totalNumOfPictures) {
      refs.buttonLoadMore.style.display = null;
    }
  }, 500);
};

const onLoadMore = () => {
  pageCounter += 1;
  gettingPhoto(queryParam, pageCounter);
};

refs.form.addEventListener("submit", onInput);
refs.buttonLoadMore.addEventListener("click", onLoadMore);
