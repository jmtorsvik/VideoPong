import React from "react";
import ReactDOM from "react-dom";
import Game from "./Game";
import Video from "./component/Video";
import Register from "./component/Register";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Store, { ParticipantContext } from "./component/ParticaipantContext";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
