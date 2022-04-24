import { Video } from "@andyet/simplewebrtc";
import { useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./component/Register";
import Game from "./Game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </BrowserRouter>
  );
}
