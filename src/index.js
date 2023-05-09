// import axios from "axios";
// import debounce from "lodash.debounce";
import API from "./apiCalls.js";

refs = {
  inputEl: document.querySelector("#search-form"),
};

// API_KEY = process.env.API_KEY;
// BASE_URL = `https://pixabay.com/api/?key=`;
// let queryParam;
// console.log(queryParam);
// async function getPictures(queryParameters) {
//   console.log("insede api call " + queryParameters);

//   console.log(`${BASE_URL}${API_KEY}&q=${queryParameters}`);
//   return await axios.get(`${BASE_URL}${API_KEY}&q=${queryParameters}`);
// }
const onInput = (e) => {
  e.preventDefault();

  const { searchQuery } = e.target.elements;
  const queryParam = searchQuery.value;
    API.getPictures(queryParam).then(({ data }) => console.log(data));
    searchQuery.value = "";
};

refs.inputEl.addEventListener("submit", onInput);
