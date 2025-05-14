import axios from "axios";

const API = axios.create({
    baseURL: "https://staging.walkyapp.com/",
});

export default API;