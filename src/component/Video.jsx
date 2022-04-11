import React, { useState } from "react";
import VideoApp from "./VideoApp";
import "./css/video.css";

function Video() {
  const [isFull, setIsFull] = useState(false);
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
