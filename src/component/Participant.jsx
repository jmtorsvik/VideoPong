import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./css/participant.css";

function Participant({ participantName, onChangeValue }) {
  return (
    <div className="participant-card">
      <div className="name-display">
        <p>{participantName}</p>
      </div>
      <div className="button-align">
        <Button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onChangeValue}
        >
          Play game
        </Button>
      </div>
    </div>
  );
}
export default Participant;
