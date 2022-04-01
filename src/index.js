import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Video from "./component/Video";
import Register from "./component/Register"
import reportWebVitals from "./reportWebVitals";
<<<<<<< HEAD
import { Connector } from "mqtt-react-hooks";

ReactDOM.render(
  <React.StrictMode>
    <Connector
      brokerUrl={"ws://test.mosquitto.org:8080"}
      servers={[
        {
          host: "mqtt.item.ntnu.no",
          port: 1883,
          protocol: "mqtt",
        },
      ]}
      options={{
        protocol: "mqtt",
        keepalive: 120,
      }}
    >
      <App />
    </Connector>
  </React.StrictMode>,
=======
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/game" element={<App />} />
            <Route path="/video" element={<Video />} />
        </Routes>
    </Router>,
>>>>>>> origin/video
  document.getElementById("root")
);

reportWebVitals();
