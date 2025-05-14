import axios from "axios";

const API = axios.create({
    baseURL: "https://staging.walkyapp.com/",
    headers: {
        'Authorization':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE5MWE1ZjNmZDdjMGM1OTQ5YjBjYTciLCJlbWFpbCI6Imlyb3NpMDAyQGZpdS5lZHUiLCJyb2xlIjoiMjM1NiIsImlhdCI6MTc0NjU1NDE2OSwiZXhwIjoxNzU0MzMwMTY5fQ.xOQBjx2iUfabRf28ZUBq-jSk6PtLL_OUkbwA93hZ7p8'
    }
});

export default API;