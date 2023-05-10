// import debounce from "lodash.debounce";
import API from "./apiCalls.js";

refs = {
  inputEl: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  buttonLoadMore: document.querySelector("button[type='button']"),
};

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
  <img src=${webformatURL} alt="${tags}" loading="lazy" />
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
async function gettingPhoto(queryParam, pageCounter) {
  const response = await API.getPictures(queryParam, pageCounter);
  const data = await response.data;
  markupOfPictures(data);
}
const onInput = (e) => {
  e.preventDefault();
  refs.gallery.innerHTML = "";
  refs.buttonLoadMore.disabled = false;

  pageCounter = 1;
  const { searchQuery } = e.target.elements;
  queryParam = searchQuery.value;
  gettingPhoto(queryParam, pageCounter);

  if (!pageCounter) {
    refs.buttonLoadMore.disabled = true;
  }
  searchQuery.value = "";
};

const onLoadMore = () => {
  pageCounter += 1;
  gettingPhoto(queryParam, pageCounter);
};

refs.inputEl.addEventListener("submit", onInput);
refs.buttonLoadMore.addEventListener("click", onLoadMore);
