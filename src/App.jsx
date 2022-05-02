import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { GameContext } from "./component/GameContext";
import { ParticipantContext } from "./component/ParticaipantContext";
import Register from "./component/Register";
import Video from "./component/Video";
import client from "./lib/mqtt";

export default function App() {
  const [participants, setParticipants] = useState(new Set());
  const [game, setGame] = useState(null);

  const value = useMemo(
    () => ({ participants, setParticipants }),
    [participants, setParticipants]
  );

  const gameValue = useMemo(() => ({ game, setGame }), [game, setGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      const username = localStorage.getItem("username");
      const office = localStorage.getItem("office");
      if (username) {
        client.publish(
          "/ponggame/new_user",
          JSON.stringify({ username, office: office === "true" ? true : false })
        );
      }
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    client.on("connect", function () {
      client.subscribe("/ponggame/#");
      client.on("message", (topic, message, packet) => {
        if (topic === "/ponggame/new_user") {
          const { username } = JSON.parse(message);
          const old_participants = participants;
          old_participants.add(username);
          setParticipants(old_participants);
        } else if (topic === "/ponggame/cancel") {
          const { opponent, initiator } = JSON.parse(message);
          if (
            opponent === localStorage.getItem("username") ||
            initiator === localStorage.getItem("username")
          ) {
            setGame(null);
          }
        } else if (topic === "/ponggame/user_leave") {
          const { username } = JSON.parse(message);
          const old_participants = participants;
          old_participants.delete(username);
          setParticipants(old_participants);
        }
      });
    });
  }, []);

  return (
    <GameContext.Provider value={gameValue}>
      <ParticipantContext.Provider value={value}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/video" element={<Video />} />
        </Routes>
      </ParticipantContext.Provider>
    </GameContext.Provider>
  );
}
