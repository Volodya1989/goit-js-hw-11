import axios from "axios";

API_KEY = process.env.API_KEY;
BASE_URL = `https://pixabay.com/api/?key=`;
async function getPictures(queryParameters) {

  console.log(`${BASE_URL}${API_KEY}&q=${queryParameters}`);
  return await axios.get(`${BASE_URL}${API_KEY}&q=${queryParameters}`);
}
export default { getPictures };