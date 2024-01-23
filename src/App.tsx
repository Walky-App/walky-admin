import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout";
import Login from "./pages/login";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
