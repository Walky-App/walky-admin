import axios from "axios";

const API = axios.create({
    baseURL: "https://staging.walkyapp.com",
    headers: {
    // This needs to be not hard coded
    'Authorization': 'lol'
  }
});

export default API;