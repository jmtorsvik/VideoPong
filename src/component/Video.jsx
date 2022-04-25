import React, { useContext, useEffect, useState } from "react";
import VideoApp from "./VideoApp";
import "./css/video.css";
import { ParticipantContext } from "./ParticaipantContext";
import client from "../lib/mqtt";
import { GameContext } from "./GameContext";

function Video() {
  const { game, setGame } = useContext(GameContext);

  useEffect(() => {
    client.subscribe("/ponggame/#");
    client.on("message", (topic, message, packet) => {
      if (topic === "/ponggame/start_game") {
        const { participants, timestamp } = JSON.parse(message);
        const initiator = participants[0];
        const opponent = participants[1];

        if (
          initiator === localStorage.getItem("username") ||
          opponent === localStorage.getItem("username")
        ) {
          setGame({ initiator, opponent, timestamp });
        }
      }
    });
  }, []);
  return (
    <div className="video-view">
      <VideoApp isNormalMode={!game} />
    </div>
  );
}
export default Video;
