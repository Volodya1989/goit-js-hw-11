// import debounce from "lodash.debounce";
import API from "./apiCalls.js";

refs = {
  inputEl: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
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
  refs.gallery.insertAdjacentHTML("afterbegin", markup);
};

const onInput = (e) => {
  e.preventDefault();

  const { searchQuery } = e.target.elements;
  const queryParam = searchQuery.value;
  API.getPictures(queryParam).then(({ data }) => {
    console.log(data.hits);
    markupOfPictures(data);
  });
  searchQuery.value = "";
};

refs.inputEl.addEventListener("submit", onInput);
