import axios from "axios";

API_KEY = "36217922-a5a1e017917ad4e4c89a8ab46";
BASE_URL = `https://pixabay.com/api/?key=`;
PARAMS = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=`;
async function getPictures(searchKeyWord, pageNumber) {
  return await axios.get(
    `${BASE_URL}${API_KEY}&q=${encodeURIComponent(
      searchKeyWord
    )}${PARAMS}${pageNumber}`
  );
}
export default { getPictures };
