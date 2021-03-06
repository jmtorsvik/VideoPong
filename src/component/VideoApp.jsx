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
import jwt from "jsonwebtoken";

// ====================================================================
// IMPORTANT SETUP
// ====================================================================
// Replace `YOUR_PUBLISHABLE_API_KEY` here with the Publishable API Key
// you received when signing up for SimpleWebRTC
// --------------------------------------------------------------------
const API_KEY = "bb5f1b02c62c47568a0d759e";
// ====================================================================

const ROOM_NAME = "mittrom";
const CONFIG_URL = `https://api.simplewebrtc.com/config/user/${API_KEY}`;

const store = SWRTC.createStore();

export default function VideoApp({ isNormalMode }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { participants, setParticipants } = useContext(ParticipantContext);
  const [userData, setUserData] = useState(null);
  const { game, setGame } = useContext(GameContext);
  const [totalPages, setTotalPages] = useState(
    Array.from(participants).length === 0
      ? 1
      : isNormalMode
      ? Math.ceil(Array.from(participants).length / 9)
      : Math.ceil(Array.from(participants).length / 4)
  );

  function layoutReset() {
    setCurrentPage(0);
    setTotalPages(
      Array.from(participants).length === 0
        ? 1
        : isNormalMode
        ? Math.ceil(Array.from(participants).length / 9)
        : Math.ceil(Array.from(participants).length / 4)
    );
  }

  useEffect(() => {
    setTotalPages(
      Array.from(participants).length === 0
        ? 1
        : isNormalMode
        ? Math.ceil(Array.from(participants).length / 9)
        : Math.ceil(Array.from(participants).length / 4)
    );
  }, [participants]);

  useEffect(() => {
    if (localStorage.getItem("username")) {
      const userDataToken = jwt.sign(
        {
          id: Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")
            .substr(0, 5),
          username: localStorage.getItem("username"),
        },
        "191e4eed-a0fc-4e0a-8bf3-3dbfbbbefb64"
      );
      setUserData(userDataToken);
    }
  }, []);

  function leave() {
    const isOffice = localStorage.getItem("office") === "true" || false
    client.publish(
      "/ponggame/user_leave",
      JSON.stringify({ username: localStorage.getItem("username"), office: isOffice })
    );
    setTimeout(() => {
      localStorage.removeItem("username");
      window.location.href = "/";
    }, 3000);
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
    const isOffice = localStorage.getItem("office") === "true" || false

    client.publish("/ponggame/cancel", JSON.stringify({...game, ...{office: isOffice}}));
    layoutReset();
  }

  function findMatchingPeer(remoteMedia, peers) {
    console.log(remoteMedia);
    console.log(peers);
    return peers.find((elem) => elem.peerAddress === remoteMedia.owner);
  }

  if (!userData) return null;

  return (
    <Provider store={store}>
      <SWRTC.Provider configUrl={CONFIG_URL} userData={userData}>
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
          <SWRTC.Room name={ROOM_NAME}>
            {(props) => {
              if (!props.room.joined) {
                return <h1>Joining room...</h1>;
              }
              const remoteVideos = props.remoteMedia.filter(
                (m) => m.kind === "video"
              );
              const localVideos = props.localMedia.filter(
                (m) => m.kind === "video" && m.shared
              );
              console.log(remoteVideos);
              console.log(localVideos);
              console.log(props.peers);

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
                          ? [...localVideos, ...remoteVideos]
                              .slice(9 * currentPage)
                              .map((value, index) => (
                                <div key={index} className="grid-item">
                                  <Video media={value} className="video" />

                                  <span>
                                    {index === 0
                                      ? localStorage.getItem("username")
                                      : props.peers[index]?.customerData
                                          ?.username}
                                  </span>
                                </div>
                              ))
                          : [...localVideos, ...remoteVideos]
                              .slice(9 * currentPage, 9 + 9 * currentPage)
                              .map((value, index) => (
                                <div key={index} className="grid-item">
                                  <Video media={value} className="video" />
                                  <span>
                                    {index === 0
                                      ? localStorage.getItem("username")
                                      : props.peers[index]?.customerData
                                          ?.username}
                                  </span>
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
                          <Button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => leave()}
                          >
                            Leave room
                          </Button>
                        </div>
                      </div>
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
                          ? [...localVideos, ...remoteVideos]
                              .slice(9 * currentPage)
                              .map((value, index) => (
                                <div
                                  key={index}
                                  className="grid-item game-mode"
                                >
                                  <Video media={value} className="video" />

                                  <span>
                                    {index === 0
                                      ? localStorage.getItem("username")
                                      : props.peers[index]?.customerData
                                          ?.username}
                                  </span>
                                </div>
                              ))
                          : [...localVideos, ...remoteVideos]
                              .slice(9 * currentPage, 9 + 9 * currentPage)
                              .map((value, index) => (
                                <div
                                  key={index}
                                  className="grid-item game-mode"
                                >
                                  <Video media={value} className="video" />
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
