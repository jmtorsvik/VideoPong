import React, {useState} from "react";
import "./css/register.css"; // Css gjøres i css fila og du can bruke class name slik som vist i div her
import {Button, Form} from "react-bootstrap";



function Register() {
    const [input, setInput] = useState("");
    const [isRegistered, setIsRegistered] = useState(localStorage.getItem('komSys')); //Kan state settes når man har sjekket om det er lagret en tidligere innlogging i browser

    function onSubmitPress() {
        localStorage.setItem('komSys', input);
        setIsRegistered(input)
    }


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
                            onChange={e => setInput(e.target.value)}
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
