import axios from "axios";

const API = axios.create({
    baseURL: "https://staging.walkyapp.com",
    headers: {
    // This needs to be not hard coded
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY3ZjNlODFjYTYwOGU5ZTc2NDdlYzEiLCJlbWFpbCI6ImdhbEB3YWxreWFwcC5jb20iLCJyb2xlIjoiNzg5MSIsImlhdCI6MTc0NjU2MTk3OCwiZXhwIjoxNzU0MzM3OTc4fQ.P_tyqdJk5bF0HaoFTcZG_IE35BrfccVkmG_UFkpBTZU'
  }
});

export default API;