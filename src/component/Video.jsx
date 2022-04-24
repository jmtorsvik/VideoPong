import React, { useContext, useState } from "react";
import VideoApp from "./VideoApp";
import "./css/video.css";
import { ParticipantContext } from "./ParticaipantContext";
import * as SWRTC from "@andyet/simplewebrtc";
import { Provider } from "react-redux";

function Video() {
  const [isFull, setIsFull] = useState(true);
  const [participants, setParticipants] = useContext(ParticipantContext);
  const store = SWRTC.createStore();

  function handleChange() {
    setIsFull(!isFull);
  }
  return (
    <Provider store={store}>
      <div className="video-view">
        <VideoApp isFullScreen={isFull} onChangeValue={() => handleChange()} />
      </div>
    </Provider>
  );
}
export default Video;
