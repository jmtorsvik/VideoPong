import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Connector } from "mqtt-react-hooks";

ReactDOM.render(
  <React.StrictMode>
    <Connector brokerUrl="wss://test.mosquitto.org:1884">
      <App />
    </Connector>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
