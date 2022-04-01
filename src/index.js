import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
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
  document.getElementById("root")
);

reportWebVitals();
