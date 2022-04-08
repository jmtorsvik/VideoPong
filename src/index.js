import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Video from "./component/Video";
import Register from "./component/Register";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/game" element={<App />} />
      <Route path="/video" element={<Video />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
