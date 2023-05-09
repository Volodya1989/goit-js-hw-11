import axios from "axios";

API_KEY = process.env.API_KEY;
BASE_URL = `https://pixabay.com/api/?key=`;
PARAMS = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=`;
async function getPictures(queryParameters,pageNumber) {
  console.log(`${BASE_URL}${API_KEY}&q=${queryParameters}${PARAMS}${pageNumber}`);
  return await axios.get(`${BASE_URL}${API_KEY}&q=${queryParameters}`);
}
export default { getPictures };
