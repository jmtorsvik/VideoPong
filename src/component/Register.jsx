import React, { useEffect, useState } from "react";
import "./css/register.css";
import { Button, Form } from "react-bootstrap";
import client from "../lib/mqtt";

const directions = ["Nord", "Sør", "Vest", "Øst"];

function Register() {
  const [input, setInput] = useState("");
  const [isRegistered, setIsRegistered] = useState(
    localStorage.getItem("username")
  );

  function onSubmitPress() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const office = urlParams.get("office");
    if (office) {
      localStorage.setItem("office", "true");
      localStorage.setItem(
        "username",
        "Kontor " + directions[Math.floor(Math.random() * directions.length)]
      );
      setIsRegistered(
        "Kontor " + directions[Math.floor(Math.random() * directions.length)]
      );
    } else {
      localStorage.setItem("username", input);
      setIsRegistered(input);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const office = urlParams.get("office");
    if (office) {
      onSubmitPress();
    }
  }, []);

  if (!isRegistered) {
    return (
      <div className="register-main">
        <div className="register-container">
          <div className="register-content">
            <h1>Name</h1>
            <Form.Control
              type="text"
              id="name"
              className="input-name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Button
              type="button"
              className="btn btn-primary"
              onClick={() => onSubmitPress()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return window.location.replace("/video");
  }
}

export default Register;
