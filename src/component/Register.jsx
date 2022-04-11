import React, {useState} from "react";
import "./css/register.css";
import {Button, Form} from "react-bootstrap";


function Register() {

  {/*
  Dette er en react hook. De er fantastiske og funker slik at du kan lagre variabler der med den første const "input"
  og endre det med å bruke nr 2 "setInput.
  Du kan se bruken i eksempelet lengere ned
  hver gang det skjer en endring i "state" vil den reloade siden"
  */}
  const [input, setInput] = useState("")

  //Funksjon av ting som gjøres etter at noen har trykket på knappen
  //Burde sjekke at input ikke er null eller en tom streng.
  function onSubmitPress(){

  }

  // has not registered before
  if (true) {
    return (
      <div className="register-main">
        <h1>Hello</h1>
        <Form.Control
            type="text"
            id="name"
            value={input}
            onChange={e => setInput(e.target.value)}
        />

        {/* nå kaller den bare console.log, men den skal jo helst kalle den funksjonen den trenger*/}
        <Button
            type="button"
            className="btn btn-primary"
            onClick={() => console.log(input)}
        >
          Submit
        </Button>
      </div>
    );
  } else {
    return window.location.replace("/video");
  }
}

export default Register;
