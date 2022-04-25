import { Provider } from "react-redux";
import React, { useContext, useEffect, useState } from "react";
import * as SWRTC from "@andyet/simplewebrtc";
import {
  getAudioOutputDevice,
  getGlobalVolumeLimit,
  getMediaTrack,
} from "@andyet/simplewebrtc/Selectors";
import { joinRoom } from "@andyet/simplewebrtc/actions";
import "./css/videoApp.css";
import { Button } from "react-bootstrap";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCamera,
  FaMicrophone,
  FaVideo,
} from "react-icons/fa";
import { Audio, Video } from "@andyet/simplewebrtc";
import Participant from "./Participant";
import { ParticipantContext } from "./ParticaipantContext";
import client from "../lib/mqtt";
import { GameContext } from "./GameContext";
import Game from "./Game";

// ====================================================================
// IMPORTANT SETUP
// ====================================================================
// Replace `YOUR_PUBLISHABLE_API_KEY` here with the Publishable API Key
// you received when signing up for SimpleWebRTC
// --------------------------------------------------------------------
const API_KEY = "15d3a1c84bb2df4361ad55cb";
// ====================================================================

const ROOM_NAME = "YOUR_ROOM_NAME";
const ROOM_PASSWORD = "YOUR_ROOM_PASSWORD";
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

const store = SWRTC.createStore();

export default function VideoApp({ isNormalMode }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { participants, setParticipants } = useContext(ParticipantContext);
  const { game, setGame } = useContext(GameContext);
  const [totalPages, setTotalPages] = useState(
    isNormalMode
      ? Math.ceil(Array.from(participants).length / 9)
      : Math.ceil(Array.from(participants).length / 4)
  );

  function layoutReset() {
    setCurrentPage(0);
    setTotalPages(
      !isNormalMode
        ? Math.ceil(Array.from(participants).length / 9)
        : Math.ceil(Array.from(participants).length / 4)
    );
  }

  useEffect(() => {
    client.subscribe("/ponggame/#");
    client.on("message", (topic, message, packet) => {
      if (topic === "/ponggame/start_game") {
        const { participants } = JSON.parse(message);
        const initiator = participants[0];
        const opponent = participants[1];

        if (
          initiator === localStorage.getItem("username") ||
          opponent === localStorage.getItem("username")
        ) {
          layoutReset();
        }
      }
    });
  }, []);

  function cancelGame() {
    client.publish("/ponggame/cancel", JSON.stringify(game));
    layoutReset();
  }

  return (
    <Provider store={store}>
      <SWRTC.Provider configUrl={CONFIG_URL}>
        {/* Render based on the connection state */}
        <SWRTC.Connecting>
          <h1>Connecting...</h1>
        </SWRTC.Connecting>

        <SWRTC.Connected>
          {/* Request the user's media */}
          <SWRTC.RequestUserMedia audio video auto />

          {/* Enable playing remote audio. */}
          <SWRTC.RemoteAudioPlayer />

          {/* Connect to a room with a name and optional password */}
          <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD}>
            {(props) => {
              if (isNormalMode) {
                return (
                  <div className="horizontal">
                    <div className="video-main">
                      <div className="btn">
                        <Button
                          type="button"
                          className="btn btn-default"
                          aria-label="Left Align"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          <FaAngleLeft />
                        </Button>
                      </div>

                      <div className="grid-container-full">
                        {currentPage === totalPages
                          ? Array.from(participants)
                              .slice(9 * currentPage)
                              .map((value, index) => (
                                <div key={index} className="grid-item">
                                  {value}
                                </div>
                              ))
                          : Array.from(participants)
                              .slice(9 * currentPage, 9 + 9 * currentPage)
                              .map((value, index) => (
                                <div key={index} className="grid-item">
                                  {value}
                                </div>
                              ))}
                      </div>
                      <div className="btn">
                        <Button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          <FaAngleRight />
                        </Button>
                      </div>
                    </div>
                    <div className="control-full">
                      <div className="btn">
                        <Button type="button" className="btn btn-primary">
                          Play game
                        </Button>
                      </div>
                      <div className="overflow-auto participants-view">
                        {Array.from(participants).map((value, index) => (
                          <Participant key={index} participantName={value} />
                        ))}
                      </div>
                      <div className="horizontal">
                        <div className="btn">
                          <Button type="button" className="btn btn-primary">
                            <FaMicrophone />
                          </Button>
                        </div>
                        <div className="btn">
                          <Button type="button" className="btn btn-primary">
                            <FaVideo />
                          </Button>
                        </div>
                        <div className="btn">
                          <Button type="button" className="btn btn-danger">
                            Leave room
                          </Button>
                        </div>
                      </div>
                      <div className="video-me">...</div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="vertical">
                    <div className="pong">
                      <Game />
                    </div>
                    <div className="video-stripe">
                      <div className="btn">
                        <Button
                          type="button"
                          className="btn btn-default"
                          aria-label="Left Align"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          <FaAngleLeft />
                        </Button>
                      </div>

                      <div className="grid-container-small">
                        {currentPage === totalPages
                          ? Array.from(participants)
                              .slice(4 * currentPage)
                              .map((value, index) => (
                                <div key={index} className="grid-item">
                                  {value}
                                </div>
                              ))
                          : Array.from(participants)
                              .slice(4 * currentPage, 4 + 4 * currentPage)
                              .map((value, index) => (
                                <div key={index} className="grid-item">
                                  {value}
                                </div>
                              ))}
                      </div>
                      <div className="btn">
                        <Button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          <FaAngleRight />
                        </Button>
                      </div>
                      <div className="vertical control-small">
                        <div className="btn">
                          <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => cancelGame()}
                          >
                            End game
                          </Button>
                        </div>
                        <div className="horizontal">
                          <div className="btn">
                            <Button type="button" className="btn btn-primary">
                              <FaMicrophone />
                            </Button>
                          </div>
                          <div className="btn">
                            <Button type="button" className="btn btn-primary">
                              <FaVideo />
                            </Button>
                          </div>
                        </div>
                        <div className="btn">
                          <Button type="button" className="btn btn-danger">
                            Leave room
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            }}
          </SWRTC.Room>
        </SWRTC.Connected>
      </SWRTC.Provider>
    </Provider>
  );
}
