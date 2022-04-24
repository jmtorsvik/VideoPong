import React, { useContext, useState } from "react";
import VideoApp from "./VideoApp";
import "./css/video.css";
import { ParticipantContext } from "./ParticaipantContext";

function Video() {
  const [isFull, setIsFull] = useState(true);
  const { participants, setParticipants } = useContext(ParticipantContext);
  function handleChange() {
    setIsFull(!isFull);
  }
  return (
    <div className="video-view">
      <VideoApp isFullScreen={isFull} onChangeValue={() => handleChange()} />
    </div>
  );
}
export default Video;
