import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ParticipantContext } from "./component/ParticaipantContext";
import Register from "./component/Register";
import Video from "./component/Video";
import Game from "./Game";
import client from "./lib/mqtt";

export default function App() {
  const [participants, setParticipants] = useState([]);

  const value = useMemo(
    () => ({ participants, setParticipants }),
    [participants, setParticipants]
  );

  useEffect(() => {
    client.on("connect", function () {
      client.subscribe("/ponggame/#");
      console.log("CONNECTED");
      client.on("message", (topic, message, packet) => {
        console.log(topic);
        if (topic === "/ponggame/new_user") {
          const { username } = JSON.parse(message);
          if (username !== localStorage.getItem("username")) {
            setParticipants((prevState) => [...prevState, username]);
            client.publish(
              "/ponggame/new_user",
              JSON.stringify({ username: localStorage.getItem("username") })
            );
          }
        }
      });
    });
  }, []);

  return (
    <ParticipantContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </ParticipantContext.Provider>
  );
}
