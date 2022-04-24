import React, { useEffect, useMemo, useState } from "react";
import client from "../lib/mqtt";
export const ParticipantContext = React.createContext(null);

export default function Store({ children }) {
  const [participants, setParticipants] = useState([]);

  const value = useMemo(
    () => ({ participants, setParticipants }),
    [participants, setParticipants]
  );
  useEffect(() => {
    client.on("connect", function () {
      console.log("CONT");
      client.subscribe("/ponggame/#", function (err, granted) {
        console.log(granted);
      });
      client.on("message", (topic, message, packet) => {
        console.log(topic);
        if (topic === "/ponggame/new_user") {
          const { username } = JSON.parse(message);
          console.log("NEW USER JOINED: " + username);
          setParticipants((prevState) => [...prevState, username]);
        }
      });
    });
  }, []);

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
}
