import React, { useState } from "react";
import { Button } from "react-bootstrap";
import client from "../lib/mqtt";
import "./css/participant.css";

function Participant({ participantName }) {
  function isMyself() {
    return localStorage.getItem("username") === participantName;
  }

  function startGame() {
    try {
      const now = new Date();
      now.setSeconds(now.getSeconds() + 1);
      const isOffice = localStorage.getItem("office") === "true" || false;

      client.publish(
        "/ponggame/start_game",
        JSON.stringify({
          participants: [localStorage.getItem("username"), participantName],
          timestamp: now,
          office: isOffice,
        })
      );
    } catch (err) {}
  }

  return (
    <div className="participant-card">
      <div className="name-display">
        <p>{participantName}</p>
      </div>
      <div className="button-align">
        {!isMyself() && (
          <Button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              startGame();
            }}
          >
            Play game
          </Button>
        )}
      </div>
    </div>
  );
}
export default Participant;
